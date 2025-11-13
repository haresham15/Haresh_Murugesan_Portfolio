# Helper script to insert FloatingGeometry between rows
$file = "BentoHero.jsx"
$lines = @(Get-Content $file)
$newLines = @()

$insertAfterLine = 103  # After the closing of Tile C

for ($i = 0; $i -lt $lines.Count; $i++) {
  $newLines += $lines[$i]
  
  # After line 103, insert the animation component
  if ($i -eq $insertAfterLine - 1) {
    $newLines += ""
    $newLines += "      {/* Floating Geometry Animation - Between Rows */}"
    $newLines += "      <div className='mb-4'>"
    $newLines += "        <FloatingGeometry />"
    $newLines += "      </div>"
    $newLines += ""
    $newLines += "      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>"
  }
}

# Write back
$newLines | Set-Content $file -Encoding UTF8

Write-Host "File updated successfully"
