#!/usr/bin/env python3
"""Update BentoHero.jsx to include FloatingGeometry animation between rows"""

with open('BentoHero.jsx', 'r') as f:
    content = f.read()

# Add the import at the top after the motion import
content = content.replace(
    "import { motion } from 'framer-motion';",
    "import { motion } from 'framer-motion';\nimport FloatingGeometry from './FloatingGeometry';"
)

# Split the grid into two - close after Tile C and re-open after animation
# Find the pattern: after the 3rd motion.div closes (Tile C)
# and before the 4th motion.div starts (Tile D)

lines = content.split('\n')
new_lines = []
tile_count = 0

for i, line in enumerate(lines):
    new_lines.append(line)
    
    # Count motion.div opens in the grid
    if '<motion.div' in line and i > 35:  # After the BentoHero function
        tile_count += 1
    
    # After Tile C closes (3rd motion.div)
    if tile_count == 3 and '        </motion.div>' in line and i < 110:
        # Add the closing grid div and animation
        new_lines.append('')
        new_lines.append("      </div>")
        new_lines.append('')
        new_lines.append("      {/* Floating Geometry Animation - Between Rows */}")
        new_lines.append("      <div className=\"mb-4\">")
        new_lines.append("        <FloatingGeometry />")
        new_lines.append("      </div>")
        new_lines.append('')
        new_lines.append("      {/* Row 2 */}")
        new_lines.append("      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">")
        
        # Skip the original opening grid div from this point
        skip_next_grid = True
        for j in range(i+1, min(i+10, len(lines))):
            if '<div className="grid grid-cols-1' in lines[j]:
                lines[j] = ''  # Mark for skipping
                break

# Remove marked lines
final_lines = [line for line in new_lines if line is not None]

output = '\n'.join(final_lines)

with open('BentoHero.jsx', 'w') as f:
    f.write(output)

print("✓ BentoHero.jsx updated successfully")
