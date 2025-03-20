const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Define paths for Input and Output directories
const inputDir = path.join(__dirname, 'Input');
const outputDir = path.join(__dirname, 'Output');

// Make sure the Output directory exists (create if not)
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to parse XML files to JSON and write them to the Output directory
function parseXMLFiles() {
    // Read all files in the Input directory
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading the Input directory:', err);
            return;
        }

        // Filter out non-XML files
        const xmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.xml');

        if (xmlFiles.length === 0) {
            console.log('No XML files found in the Input directory.');
            return;
        }

        // Parse each XML file
        xmlFiles.forEach(file => {
            const filePath = path.join(inputDir, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                // Use xml2js to parse the XML string into a JSON object
                xml2js.parseString(data, { explicitArray: false }, (err, result) => {
                    if (err) {
                        console.error(`Error parsing XML in ${file}:`, err);
                        return;
                    }

                    // Construct the output file path
                    const jsonFilePath = path.join(outputDir, `${path.basename(file, '.xml')}.json`);

                    // Write the resulting JSON object to a new file
                    fs.writeFile(jsonFilePath, JSON.stringify(result, null, 2), 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing JSON to ${jsonFilePath}:`, err);
                        } else {
                            console.log(`Successfully converted ${file} to JSON.`);
                        }
                    });
                });
            });
        });
    });
}

// Execute the function
parseXMLFiles();
