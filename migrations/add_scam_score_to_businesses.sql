-- Add scam_score column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS scam_score DECIMAL(3,1);

-- Add report_count column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS report_count INTEGER;

-- Update existing businesses with a default scam_score of 0
UPDATE businesses SET scam_score = 0 WHERE scam_score IS NULL;

-- Create an index on scam_score for faster sorting
CREATE INDEX IF NOT EXISTS idx_businesses_scam_score ON businesses(scam_score);

-- Create a function to calculate scam score
CREATE OR REPLACE FUNCTION calculate_business_scam_score(business_name_param TEXT)
RETURNS DECIMAL(3,1) AS $$
DECLARE
    report_count INTEGER;
    recency_factor DECIMAL(3,1);
    severity_factor DECIMAL(3,1);
    newest_report_date TIMESTAMP;
    scam_score DECIMAL(3,1);
BEGIN
    -- Get report count
    SELECT COUNT(*) INTO report_count
    FROM reports
    WHERE business_name ILIKE business_name_param;
    
    IF report_count = 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate report count factor (0-10)
    -- Max out at 20 reports
    report_count := LEAST(report_count, 20);
    
    -- Get newest report date
    SELECT MAX(created_at) INTO newest_report_date
    FROM reports
    WHERE business_name ILIKE business_name_param;
    
    -- Calculate recency factor (0-10)
    -- Reports in the last 30 days get higher scores
    recency_factor := CASE
        WHEN newest_report_date > (CURRENT_DATE - INTERVAL '7 days') THEN 10
        WHEN newest_report_date > (CURRENT_DATE - INTERVAL '30 days') THEN 8
        WHEN newest_report_date > (CURRENT_DATE - INTERVAL '90 days') THEN 6
        WHEN newest_report_date > (CURRENT_DATE - INTERVAL '180 days') THEN 4
        WHEN newest_report_date > (CURRENT_DATE - INTERVAL '365 days') THEN 2
        ELSE 1
    END;
    
    -- Calculate severity factor (0-10)
    -- Different report types have different severity weights
    SELECT AVG(
        CASE report_type
            WHEN 'price_gouging' THEN 7
            WHEN 'no_receipt' THEN 5
            WHEN 'suspicious_activity' THEN 8
            WHEN 'unauthorized_charges' THEN 9
            WHEN 'false_advertising' THEN 6
            WHEN 'hidden_fees' THEN 7
            ELSE 5
        END
    ) INTO severity_factor
    FROM reports
    WHERE business_name ILIKE business_name_param;
    
    -- Calculate final score (0-10 scale)
    scam_score := (report_count * 0.5 / 2) + (recency_factor * 0.3) + (severity_factor * 0.2);
    
    -- Round to one decimal place
    RETURN ROUND(scam_score, 1);
END;
$$ LANGUAGE plpgsql;

-- Create a function to update business scam scores
CREATE OR REPLACE FUNCTION update_all_business_scam_scores()
RETURNS VOID AS $$
DECLARE
    business_rec RECORD;
BEGIN
    FOR business_rec IN SELECT name FROM businesses LOOP
        -- Update scam score
        UPDATE businesses
        SET scam_score = calculate_business_scam_score(business_rec.name)
        WHERE name = business_rec.name;
        
        -- Update report count
        UPDATE businesses
        SET report_count = (
            SELECT COUNT(*) 
            FROM reports 
            WHERE business_name ILIKE business_rec.name
        )
        WHERE name = business_rec.name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create or update a business from a report
CREATE OR REPLACE FUNCTION create_or_update_business_from_report()
RETURNS TRIGGER AS $$
DECLARE
    business_exists BOOLEAN;
    location_parts TEXT[];
    city_part TEXT;
    state_part TEXT;
    zip_part TEXT;
BEGIN
    -- Check if business already exists
    SELECT EXISTS(
        SELECT 1 FROM businesses WHERE name ILIKE NEW.business_name
    ) INTO business_exists;
    
    -- Parse location field (assuming format like "City, State Zip" or similar)
    location_parts := regexp_split_to_array(NEW.location, ',');
    
    IF array_length(location_parts, 1) >= 2 THEN
        city_part := trim(location_parts[1]);
        
        -- Further split the second part to get state and zip
        location_parts := regexp_split_to_array(trim(location_parts[2]), ' ');
        
        IF array_length(location_parts, 1) >= 2 THEN
            state_part := location_parts[1];
            zip_part := location_parts[2];
        ELSE
            state_part := location_parts[1];
            zip_part := '';
        END IF;
    ELSE
        -- If location doesn't follow expected format, use the whole string as address
        city_part := NEW.location;
        state_part := '';
        zip_part := '';
    END IF;
    
    IF business_exists THEN
        -- Update existing business
        UPDATE businesses
        SET 
            report_count = (SELECT COUNT(*) FROM reports WHERE business_name ILIKE NEW.business_name),
            scam_score = calculate_business_scam_score(NEW.business_name)
        WHERE name ILIKE NEW.business_name;
    ELSE
        -- Create new business
        INSERT INTO businesses (
            id,
            name,
            address,
            city,
            state,
            zip,
            report_count,
            scam_score,
            created_at
        ) VALUES (
            gen_random_uuid(), -- Generate a UUID for the id
            NEW.business_name,
            NEW.location, -- Use full location as address
            city_part,
            state_part,
            zip_part::BIGINT,
            1, -- Initial report count
            calculate_business_scam_score(NEW.business_name),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update business scam scores
CREATE OR REPLACE FUNCTION update_business_scam_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the business scam score
    UPDATE businesses
    SET 
        scam_score = calculate_business_scam_score(NEW.business_name),
        report_count = (SELECT COUNT(*) FROM reports WHERE business_name ILIKE NEW.business_name)
    WHERE name ILIKE NEW.business_name;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create or update business when a report is added
DROP TRIGGER IF EXISTS create_business_from_report_trigger ON reports;
CREATE TRIGGER create_business_from_report_trigger
AFTER INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION create_or_update_business_from_report();

-- Create trigger on reports table for updates
DROP TRIGGER IF EXISTS update_business_scam_score_trigger ON reports;
CREATE TRIGGER update_business_scam_score_trigger
AFTER UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_business_scam_score();

-- Function to get most common scams for a business
CREATE OR REPLACE FUNCTION get_most_common_scams(business_name_param TEXT, limit_count INTEGER DEFAULT 3)
RETURNS TABLE(scam_description TEXT, occurrence_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        description, 
        COUNT(*) as count
    FROM 
        reports
    WHERE 
        business_name ILIKE business_name_param
    GROUP BY 
        description
    ORDER BY 
        count DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql;

-- Sync existing reports with businesses table
CREATE OR REPLACE FUNCTION sync_businesses_from_reports()
RETURNS VOID AS $$
DECLARE
    report_rec RECORD;
    business_names TEXT[];
    current_business_name TEXT;
    location_parts TEXT[];
    city_part TEXT;
    state_part TEXT;
    zip_part TEXT;
    zip_bigint BIGINT;
BEGIN
    -- Get unique business names from reports
    SELECT ARRAY_AGG(DISTINCT reports.business_name) INTO business_names FROM reports;
    
    -- For each unique business name
    FOREACH current_business_name IN ARRAY business_names
    LOOP
        -- Check if business exists
        IF NOT EXISTS (SELECT 1 FROM businesses WHERE name ILIKE current_business_name) THEN
            -- Get a sample report for this business to extract location
            SELECT * INTO report_rec FROM reports WHERE reports.business_name ILIKE current_business_name LIMIT 1;
            
            -- Parse location field (assuming format like "City, State Zip" or similar)
            location_parts := regexp_split_to_array(report_rec.location, ',');
            
            IF array_length(location_parts, 1) >= 2 THEN
                city_part := trim(location_parts[1]);
                
                -- Further split the second part to get state and zip
                location_parts := regexp_split_to_array(trim(location_parts[2]), ' ');
                
                IF array_length(location_parts, 1) >= 2 THEN
                    state_part := location_parts[1];
                    zip_part := location_parts[2];
                ELSE
                    state_part := location_parts[1];
                    zip_part := '';
                END IF;
            ELSE
                -- If location doesn't follow expected format, use the whole string as address
                city_part := report_rec.location;
                state_part := '';
                zip_part := '';
            END IF;
            
            -- Try to convert zip to bigint, use 0 if conversion fails
            BEGIN
                zip_bigint := zip_part::BIGINT;
            EXCEPTION WHEN OTHERS THEN
                zip_bigint := 0;
            END;
            
            -- Create new business directly
            INSERT INTO businesses (
                id,
                name,
                address,
                city,
                state,
                zip,
                report_count,
                scam_score,
                created_at
            ) VALUES (
                gen_random_uuid(), -- Generate a UUID for the id
                report_rec.business_name,
                report_rec.location, -- Use full location as address
                city_part,
                state_part,
                zip_bigint,
                (SELECT COUNT(*) FROM reports WHERE reports.business_name ILIKE current_business_name),
                calculate_business_scam_score(current_business_name),
                NOW()
            );
        END IF;
    END LOOP;
    
    -- Update all business scores and counts
    PERFORM update_all_business_scam_scores();
END;
$$ LANGUAGE plpgsql;

-- Run initial calculation for all businesses
SELECT update_all_business_scam_scores();

-- Sync existing reports with businesses table
SELECT sync_businesses_from_reports();
