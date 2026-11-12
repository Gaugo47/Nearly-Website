import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

// Keep generated scenery, but never regenerate faces, interface text or branding.
// All coordinates refer to the approved 1731 × 909 composition.
const background = "assets/social-preview/nearly-social-en-v6.png";
const { width, height } = await sharp(background).metadata();
const sx = width / 1731, sy = height / 909;
const source = await sharp("public/media/store/home-screen-en.webp").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const sw = source.info.width, sh = source.info.height;
const corners = [[1220, 54], [1610, 47], [1490, 920], [1084, 899]].map(([x,y]) => [x*sx,y*sy]);

function solve(rows) {
  for (let column = 0; column < 8; column++) {
    let pivot = column;
    for (let r = column + 1; r < 8; r++) if (Math.abs(rows[r][column]) > Math.abs(rows[pivot][column])) pivot = r;
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    const divisor = rows[column][column];
    for (let c = column; c <= 8; c++) rows[column][c] /= divisor;
    for (let r = 0; r < 8; r++) if (r !== column) {
      const factor = rows[r][column];
      for (let c = column; c <= 8; c++) rows[r][c] -= factor * rows[column][c];
    }
  }
  return rows.map(row => row[8]);
}
const rows = [];
const uv = [[0,0],[sw-1,0],[sw-1,sh-1],[0,sh-1]];
corners.forEach(([x,y], i) => {
  const [u,v] = uv[i];
  rows.push([x,y,1,0,0,0,-u*x,-u*y,u]);
  rows.push([0,0,0,x,y,1,-v*x,-v*y,v]);
});
const h = solve(rows);
const pixels = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const denominator = h[6]*x + h[7]*y + 1;
  const u = (h[0]*x+h[1]*y+h[2])/denominator;
  const v = (h[3]*x+h[4]*y+h[5])/denominator;
  if (u < 0 || v < 0 || u >= sw-1 || v >= sh-1) continue;
  // Clip the original screenshot to the rounded front glass of the device.
  const radius = 100;
  const dx = Math.max(radius-u, 0, u-(sw-1-radius));
  const dy = Math.max(radius-v, 0, v-(sh-1-radius));
  const alpha = Math.min(1, Math.max(0, radius-Math.hypot(dx,dy)));
  if (!alpha) continue;
  const ix = Math.floor(u), iy = Math.floor(v), fx=u-ix, fy=v-iy;
  const output = (y*width+x)*4;
  for (let c = 0; c < 3; c++) {
    const at = (xx,yy) => source.data[(yy*sw+xx)*4+c];
    pixels[output+c] = (at(ix,iy)*(1-fx)+at(ix+1,iy)*fx)*(1-fy)+(at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx)*fy;
  }
  pixels[output+3] = Math.round(alpha*255);
}
const screen = await sharp(pixels,{raw:{width,height,channels:4}}).png().toBuffer();

// Extract the actual wordmark; remove its white matte without redrawing letters.
const wordmark = await sharp("public/media/nearly-logo.png").extract({left:420,top:0,width:860,height:315}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for (let i=0; i<wordmark.data.length; i+=4) {
  const matte = [248,246,250];
  const a = Math.max(0,1-Math.min(...matte.map((value,c) => wordmark.data[i+c]/value)));
  wordmark.data[i+3] = a < .04 ? 0 : Math.round(a*255);
  if (a >= .04) for (let c=0;c<3;c++) wordmark.data[i+c] = Math.max(0,Math.min(255,(wordmark.data[i+c]-matte[c]*(1-a))/a));
}
const lettering = await sharp(wordmark.data,{raw:wordmark.info}).resize(Math.round(300*sx),Math.round(110*sy)).png().toBuffer();
const icon = await sharp("public/media/nearly-app-icon-liquid-glass-v2.png").resize(Math.round(110*sx),Math.round(110*sy)).png().toBuffer();
const paper = await sharp("assets/social-preview/brand-paper.png").resize(Math.round(500*sx),Math.round(195*sy)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for (let y=0;y<paper.info.height;y++) for(let x=0;x<paper.info.width;x++) {
  const edge = Math.min(x,y,paper.info.width-1-x,paper.info.height-1-y);
  paper.data[(y*paper.info.width+x)*4+3] = Math.round(255*Math.min(1,edge/(18*sx)));
}
const patch = await sharp(paper.data,{raw:paper.info}).png().toBuffer();
await sharp(background).composite([
  {input:screen},
  {input:patch,left:Math.round(70*sx),top:Math.round(65*sy)},
  {input:icon,left:Math.round(104*sx),top:Math.round(100*sy)},
  {input:lettering,left:Math.round(230*sx),top:Math.round(100*sy)},
]).png().toFile("assets/social-preview/nearly-social-en-v7.png");
console.log("Original app screen, portraits and brand assets composited into the approved scenery.");
