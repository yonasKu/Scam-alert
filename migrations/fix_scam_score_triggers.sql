-- Fix the missing trigger for new reports
-- This will ensure business scam scores are updated when new reports are added

-- Create trigger on reports table for inserts
DROP TRIGGER IF EXISTS insert_business_scam_score_trigger ON reports;
CREATE TRIGGER insert_business_scam_score_trigger
AFTER INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION create_or_update_business_from_report();

-- Run a manual update to fix existing scores
SELECT update_all_business_scam_scores();
