import io

import cairosvg
from PIL import Image
import numpy as np

with open(r"Layout sample/CTA.svg", "rb") as f:
    svg_data = f.read()

png_bytes = cairosvg.svg2png(bytestring=svg_data, output_width=360)
img = Image.open(io.BytesIO(png_bytes)).convert("L").resize((90, 90))

chars = np.array(list(" .:-=+*#%@"))
arr = np.array(img)
arr = (arr / 255 * (len(chars) - 1)).astype(int)

for row in arr:
    line = "".join(chars[len(chars) - 1 - idx] for idx in row)
    print(line)

