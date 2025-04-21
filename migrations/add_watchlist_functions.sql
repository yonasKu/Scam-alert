-- Add functions for watchlist analytics

-- Function to get most watched businesses
CREATE OR REPLACE FUNCTION get_most_watched_businesses(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    business_id UUID,
    name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip BIGINT,
    report_count INTEGER,
    scam_score DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE,
    watch_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id AS business_id,
        b.name,
        b.address,
        b.city,
        b.state,
        b.zip,
        b.report_count,
        b.scam_score,
        b.created_at,
        COUNT(w.id) AS watch_count
    FROM 
        businesses b
    JOIN 
        watchlist w ON b.id = w.business_id
    GROUP BY 
        b.id
    ORDER BY 
        watch_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending businesses (those with increasing report activity)
CREATE OR REPLACE FUNCTION get_trending_businesses(limit_count INTEGER DEFAULT 10, days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    business_id UUID,
    name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip BIGINT,
    report_count INTEGER,
    scam_score DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE,
    recent_reports BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id AS business_id,
        b.name,
        b.address,
        b.city,
        b.state,
        b.zip,
        b.report_count,
        b.scam_score,
        b.created_at,
        COUNT(r.id) AS recent_reports
    FROM 
        businesses b
    JOIN 
        reports r ON LOWER(b.name) = LOWER(r.business_name)
    WHERE 
        r.created_at > NOW() - (days_back * INTERVAL '1 day')
    GROUP BY 
        b.id
    ORDER BY 
        recent_reports DESC,
        b.scam_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get watch count for a specific business
CREATE OR REPLACE FUNCTION get_business_watch_count(business_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    watch_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO watch_count
    FROM watchlist
    WHERE business_id = business_id_param;
    
    RETURN watch_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a business is in a user's watchlist
CREATE OR REPLACE FUNCTION is_business_in_watchlist(user_id_param TEXT, business_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    exists_in_watchlist BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM watchlist 
        WHERE user_id = user_id_param AND business_id = business_id_param
    ) INTO exists_in_watchlist;
    
    RETURN exists_in_watchlist;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to update business watch count if we want to track it in the businesses table
-- Uncomment and add a watch_count column to businesses table if needed
/*
-- First add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'businesses' AND column_name = 'watch_count'
    ) THEN
        ALTER TABLE businesses ADD COLUMN watch_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create a function to update the watch count
CREATE OR REPLACE FUNCTION update_business_watch_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment watch count
        UPDATE businesses
        SET watch_count = watch_count + 1
        WHERE id = NEW.business_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement watch count
        UPDATE businesses
        SET watch_count = GREATEST(watch_count - 1, 0)
        WHERE id = OLD.business_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER watchlist_update_trigger
AFTER INSERT OR DELETE ON watchlist
FOR EACH ROW
EXECUTE FUNCTION update_business_watch_count();
*/
