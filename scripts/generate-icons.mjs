#!/usr/bin/env node
/**
 * Generates simple SVG-based placeholder PWA icons.
 * Run once: node scripts/generate-icons.mjs
 * For production, replace with real icons.
 */
import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/icons')
mkdirSync(outDir, { recursive: true })

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0f172a'
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()

  // Laser beam symbol
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.28

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = size * 0.07
  ctx.lineCap = 'round'

  // Cross / target
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx, cy - r * 1.5)
  ctx.lineTo(cx, cy + r * 1.5)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx - r * 1.5, cy)
  ctx.lineTo(cx + r * 1.5, cy)
  ctx.stroke()

  writeFileSync(resolve(outDir, `icon-${size}.png`), canvas.toBuffer('image/png'))
  console.log(`Generated icon-${size}.png`)
}

generateIcon(192)
generateIcon(512)
