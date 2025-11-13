# Helper script to fix the BentoHero grid structure
$file = "BentoHero.jsx"
$lines = @(Get-Content $file)
$newLines = @()

# Find and fix the structure
for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  
  # Skip the duplicate closing divs
  if ($i -eq 102 -and $line.Trim() -eq "</div>") {
    # This is the old grid closing - we'll skip it and add new structure
    $newLines += "      </div>"  # Close the first grid
    $newLines += ""
    $newLines += "      {/* Floating Geometry Animation - Between Rows */}"
    $newLines += "      <div className='mb-4'>"
    $newLines += "        <FloatingGeometry />"
    $newLines += "      </div>"
    $newLines += ""
    $newLines += "      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>"
    # Skip the next duplicate
    $i++
  } elseif ($i -eq 103 -and $line.Trim().StartsWith("<div className='grid")) {
    # Skip this line since we added a new one above
    continue
  } else {
    $newLines += $line
  }
}

# Write back
$newLines | Set-Content $file -Encoding UTF8

Write-Host "File fixed successfully"
