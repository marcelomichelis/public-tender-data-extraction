import json
import urllib.parse
import pandas as pd

def process_har_file(filepath):
    """
    Parses a HAR (HTTP Archive) file to extract hidden procurement targets.
    """
    print(f"Loading HAR file: {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        har_data = json.load(f)

    extracted_data = []
    entries = har_data['log']['entries']
    
    print(f"Processing {len(entries)} network entries...")

    for entry in entries:
        request = entry['request']
        url = request['url']
        
        # Filtering strategy based on pattern recognition
        if "ProcessView" in url and "param1=" in url:
            
            # Extract query parameters
            parsed_url = urllib.parse.urlparse(url)
            params = urllib.parse.parse_qs(parsed_url.query)
            
            if 'param1' in params:
                # Store relevant data for the automation bot
                target = {
                    'target_url': url,
                    'method': request['method'],
                    'status': entry['response']['status'],
                    'timestamp': entry['startedDateTime']
                }
                extracted_data.append(target)

    # Export to CSV for the JS Injector
    df = pd.DataFrame(extracted_data)
    df.drop_duplicates(subset=['target_url'], inplace=True)
    print(f"Found {len(df)} unique valid targets.")
    
    output_filename = "targets_ready.csv"
    df.to_csv(output_filename, index=False)
    print(f"Data exported to {output_filename}")

if __name__ == "__main__":
    # Example usage
    process_har_file('network_logs.har')
