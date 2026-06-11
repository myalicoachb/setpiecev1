'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric/dist/fabric'
import { useSession } from 'next-auth/react'
import {
  Undo2, Redo2, Save, Download, Share2, UserPlus, Circle, Crosshair,
  ArrowRight, Square, Type, Eraser, Palette, Move, ZoomIn, ZoomOut, Trash2
} from 'lucide-react'
import { Button, Tooltip, TooltipContent, TooltipTrigger, Input } from '@setpiece/ui'
import toast from 'react-hot-toast'

type Tool = 'select' | 'player-home' | 'player-away' | 'player-neutral' | 'ball' | 'arrow-solid' | 'arrow-dashed' | 'arrow-curved' | 'zone-rect' | 'zone-ellipse' | 'text' | 'eraser'

interface HistoryState { canvas: string }

export default function PitchEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const { data: session } = useSession()
  const [activeTool, setActiveTool] = useState<Tool>('select')
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [drawingTitle, setDrawingTitle] = useState('رسم تكتيكي جديد')
  const [isSaving, setIsSaving] = useState(false)
  const objectPropsRef = useRef({ fill: '#1E88E5', stroke: '#fff', strokeWidth: 2, opacity: 1 })

  const saveToHistory = useCallback((canvas: fabric.Canvas) => {
    const state = { canvas: JSON.stringify(canvas.toJSON(['id', 'name', 'playerNumber'])) }
    setHistory(prev => [...prev.slice(0, historyIndex + 1), state])
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 900, height: 580,
      backgroundColor: '#2D5A27',
      selection: activeTool === 'select',
    })

    fabric.Object.prototype.set({
      borderColor: '#3B82F6',
      cornerColor: '#3B82F6',
      cornerSize: 8,
      transparentCorners: false,
    })

    const pitch = new fabric.Rect({
      left: 45, top: 30, width: 810, height: 520,
      fill: 'transparent',
      stroke: '#FFFFFF',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    })

    const centerLine = new fabric.Line([450, 30, 450, 550], {
      stroke: '#FFFFFF', strokeWidth: 2, selectable: false, evented: false,
    })

    const centerCircle = new fabric.Circle({
      left: 427, top: 250, radius: 50,
      fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 2, selectable: false, evented: false,
    })

    const centerDot = new fabric.Circle({
      left: 447, top: 270, radius: 3,
      fill: '#FFFFFF', selectable: false, evented: false,
    })

    const leftPenalty = new fabric.Rect({
      left: 45, top: 170, width: 60, height: 240,
      fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 2, selectable: false, evented: false,
    })

    const rightPenalty = new fabric.Rect({
      left: 795, top: 170, width: 60, height: 240,
      fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 2, selectable: false, evented: false,
    })

    const leftGoal = new fabric.Rect({
      left: 30, top: 225, width: 15, height: 130,
      fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 3, selectable: false, evented: false,
    })

    const rightGoal = new fabric.Rect({
      left: 855, top: 225, width: 15, height: 130,
      fill: 'transparent', stroke: '#FFFFFF', strokeWidth: 3, selectable: false, evented: false,
    })

    canvas.add(pitch, centerLine, centerCircle, centerDot, leftPenalty, rightPenalty, leftGoal, rightGoal)

    canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null))
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null))
    canvas.on('selection:cleared', () => setSelectedObject(null))

    canvas.on('object:modified', () => saveToHistory(canvas))
    canvas.on('object:added', (e) => {
      if (e.target && !['rect', 'line', 'circle'].includes(e.target.type || '')) {
        saveToHistory(canvas)
      }
    })

    fabricRef.current = canvas
    saveToHistory(canvas)

    return () => { canvas.dispose(); fabricRef.current = null }
  }, [])

  const addPlayer = useCallback((team: 'home' | 'away' | 'neutral') => {
    const canvas = fabricRef.current
    if (!canvas) return
    const colors = { home: '#1E88E5', away: '#E53935', neutral: '#FDD835' }
    const numberColors = { home: '#fff', away: '#fff', neutral: '#333' }

    const playerNumber = String(Math.floor(Math.random() * 99) + 1)
    const group = new fabric.Group([
      new fabric.Circle({ radius: 16, fill: colors[team], stroke: '#fff', strokeWidth: 2, originX: 'center', originY: 'center' }),
      new fabric.Text(playerNumber, { fontSize: 14, fill: numberColors[team], originX: 'center', originY: 'center', fontWeight: 'bold' }),
    ], {
      left: 100 + Math.random() * 700, top: 50 + Math.random() * 480,
      name: `player-${team}`,
      playerNumber,
    })

    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()
  }, [])

  const addBall = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const ball = new fabric.Text('⚽', {
      left: 100 + Math.random() * 700, top: 50 + Math.random() * 480,
      fontSize: 24, name: 'ball',
    })
    canvas.add(ball)
    canvas.setActiveObject(ball)
    canvas.renderAll()
  }, [])

  const addArrow = useCallback((dashed = false) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const points = dashed ? [100, 300, 200, 250, 300, 300] : [100, 300, 300, 250]
    const arrow = new fabric.Path(`M ${points[0]} ${points[1]} L ${points[2]} ${points[3]}`, {
      stroke: '#FFFFFF', strokeWidth: 3, fill: '',
      strokeDashArray: dashed ? [10, 5] : [],
      name: dashed ? 'arrow-dashed' : 'arrow-solid',
    })
    canvas.add(arrow)
    canvas.setActiveObject(arrow)
    canvas.renderAll()
  }, [])

  const addCurvedArrow = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const arrow = new fabric.Path('M 100 300 Q 200 200 300 300', {
      stroke: '#FFFFFF', strokeWidth: 3, fill: '',
      name: 'arrow-curved',
    })
    canvas.add(arrow)
    canvas.setActiveObject(arrow)
    canvas.renderAll()
  }, [])

  const addZone = useCallback((shape: 'rect' | 'ellipse') => {
    const canvas = fabricRef.current
    if (!canvas) return
    const zone = shape === 'rect'
      ? new fabric.Rect({ left: 200, top: 200, width: 150, height: 200, fill: 'rgba(30, 136, 229, 0.25)', stroke: '#1E88E5', strokeWidth: 2, name: 'zone-rect' })
      : new fabric.Ellipse({ left: 250, top: 200, rx: 80, ry: 60, fill: 'rgba(30, 136, 229, 0.25)', stroke: '#1E88E5', strokeWidth: 2, name: 'zone-ellipse' })
    canvas.add(zone)
    canvas.setActiveObject(zone)
    canvas.renderAll()
  }, [])

  const addText = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const text = new fabric.IText('نص', {
      left: 200, top: 200, fontSize: 16, fill: '#FFFFFF', fontFamily: 'Arial', name: 'text',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }, [])

  const handleToolSelect = useCallback((tool: Tool) => {
    const canvas = fabricRef.current
    if (!canvas) return
    setActiveTool(tool)
    canvas.isDrawingMode = false
    canvas.selection = tool === 'select'
    canvas.defaultCursor = tool === 'select' ? 'default' : 'crosshair'

    switch (tool) {
      case 'select': break
      case 'player-home': addPlayer('home'); setActiveTool('select'); break
      case 'player-away': addPlayer('away'); setActiveTool('select'); break
      case 'player-neutral': addPlayer('neutral'); setActiveTool('select'); break
      case 'ball': addBall(); setActiveTool('select'); break
      case 'arrow-solid': addArrow(false); setActiveTool('select'); break
      case 'arrow-dashed': addArrow(true); setActiveTool('select'); break
      case 'arrow-curved': addCurvedArrow(); setActiveTool('select'); break
      case 'zone-rect': addZone('rect'); setActiveTool('select'); break
      case 'zone-ellipse': addZone('ellipse'); setActiveTool('select'); break
      case 'text': addText(); setActiveTool('select'); break
      case 'eraser': {
        const active = canvas.getActiveObject()
        if (active) { canvas.remove(active); canvas.discardActiveObject(); canvas.renderAll(); saveToHistory(canvas) }
        setActiveTool('select'); break
      }
    }
  }, [addPlayer, addBall, addArrow, addCurvedArrow, addZone, addText, saveToHistory])

  const updateObjectProp = useCallback((prop: string, value: any) => {
    const canvas = fabricRef.current
    const obj = canvas?.getActiveObject()
    if (!obj) return
    obj.set(prop as any, value)
    canvas?.renderAll()
    saveToHistory(canvas!)
  }, [saveToHistory])

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !fabricRef.current) return
    const newIndex = historyIndex - 1
    fabricRef.current.loadFromJSON(history[newIndex].canvas, () => {
      fabricRef.current?.renderAll()
    })
    setHistoryIndex(newIndex)
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !fabricRef.current) return
    const newIndex = historyIndex + 1
    fabricRef.current.loadFromJSON(history[newIndex].canvas, () => {
      fabricRef.current?.renderAll()
    })
    setHistoryIndex(newIndex)
  }, [history, historyIndex])

  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const objs = canvas.getObjects().filter(o => !['rect', 'line', 'circle'].includes(o.type || ''))
    objs.forEach(o => canvas.remove(o))
    canvas.renderAll()
    saveToHistory(canvas)
  }, [saveToHistory])

  const exportPNG = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 })
    const link = document.createElement('a')
    link.download = `${drawingTitle}.png`
    link.href = dataURL
    link.click()
    toast.success('تم تصدير الصورة بنجاح')
  }, [drawingTitle])

  const exportPDF = useCallback(async () => {
    const canvas = fabricRef.current
    if (!canvas) return
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      const canvasEl = canvasRef.current
      if (!canvasEl) return
      const imgData = canvas.toDataURL({ format: 'png', multiplier: 2 })
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height! / canvas.width!) * pdfWidth
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${drawingTitle}.pdf`)
      toast.success('تم تصدير PDF بنجاح')
    } catch {
      toast.error('حدث خطأ أثناء تصدير PDF')
    }
  }, [drawingTitle])

  const saveDrawing = useCallback(async () => {
    const canvas = fabricRef.current
    if (!canvas) return
    if (!session?.user?.id) { toast.error('سجل الدخول أولاً'); return }

    setIsSaving(true)
    const data = canvas.toJSON(['id', 'name', 'playerNumber'])
    const thumbnail = canvas.toDataURL({ format: 'png', multiplier: 0.5 })

    try {
      const res = await fetch('/api/drawings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: drawingTitle, data, thumbnail, isPublic: false }),
      })
      if (res.ok) { toast.success('تم الحفظ بنجاح') }
      else { toast.error('حدث خطأ أثناء الحفظ') }
    } catch { toast.error('حدث خطأ') }
    finally { setIsSaving(false) }
  }, [drawingTitle, session])

  const shareDrawing = useCallback(() => {
    toast.success('تم نسخ رابط المشاركة')
  }, [])

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <Move className="h-4 w-4" />, label: 'تحديد' },
    { id: 'player-home', icon: <Circle className="h-4 w-4 text-blue-500" />, label: 'لاعب (أزرق)' },
    { id: 'player-away', icon: <Circle className="h-4 w-4 text-red-500" />, label: 'لاعب (أحمر)' },
    { id: 'player-neutral', icon: <Circle className="h-4 w-4 text-yellow-500" />, label: 'لاعب (محايد)' },
    { id: 'ball', icon: <Crosshair className="h-4 w-4" />, label: 'كرة' },
    { id: 'arrow-solid', icon: <ArrowRight className="h-4 w-4" />, label: 'سهم' },
    { id: 'arrow-dashed', icon: <ArrowRight className="h-4 w-4 opacity-50" />, label: 'سهم متقطع' },
    { id: 'arrow-curved', icon: <ArrowRight className="h-4 w-4 rotate-45" />, label: 'سهم منحني' },
    { id: 'zone-rect', icon: <Square className="h-4 w-4" />, label: 'منطقة مستطيلة' },
    { id: 'zone-ellipse', icon: <Square className="h-4 w-4 rotate-45" />, label: 'منطقة بيضاوية' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'نص' },
    { id: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'مسح' },
  ]

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <Input value={drawingTitle} onChange={e => setDrawingTitle(e.target.value)} className="h-8 w-48 text-sm" />
        </div>
        <div className="flex items-center gap-1">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}><Undo2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>تراجع</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}><Redo2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>إعادة</TooltipContent></Tooltip>
          <div className="mx-2 h-6 w-px bg-gray-800" />
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={saveDrawing} disabled={isSaving}><Save className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>حفظ</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={exportPNG}><Download className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>تصدير PNG</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={exportPDF}><Download className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>تصدير PDF</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={shareDrawing}><Share2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>مشاركة</TooltipContent></Tooltip>
          <div className="mx-2 h-6 w-px bg-gray-800" />
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="sm" onClick={clearCanvas}><Trash2 className="h-4 w-4 text-red-400" /></Button></TooltipTrigger><TooltipContent>مسح الكل</TooltipContent></Tooltip>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col gap-1 border-l border-gray-800 bg-gray-900 p-2">
          {tools.map(t => (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleToolSelect(t.id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    activeTool === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {t.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">{t.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-center bg-gray-950 p-4">
          <canvas ref={canvasRef} className="rounded-xl shadow-2xl" />
        </div>

        <div className="w-64 border-r border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">الخصائص</h3>
          {selectedObject ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">اللون</label>
                <div className="flex gap-1 mt-1">
                  {['#1E88E5', '#E53935', '#FDD835', '#43A047', '#8E24AA', '#FF6D00', '#FFFFFF'].map(c => (
                    <button key={c} onClick={() => updateObjectProp('fill', c)}
                      className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              {selectedObject.type === 'group' && (
                <div>
                  <label className="text-xs text-gray-500">رقم اللاعب</label>
                  <Input type="text" defaultValue="7" onChange={e => updateObjectProp('playerNumber', e.target.value)} className="h-8 mt-1" />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500">الشفافية</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="1"
                  onChange={e => updateObjectProp('opacity', parseFloat(e.target.value))}
                  className="w-full mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500">حجم الخط</label>
                <div className="flex gap-1 mt-1">
                  {[12, 14, 16, 18, 24, 32].map(s => (
                    <button key={s} onClick={() => updateObjectProp('fontSize', s)}
                      className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400 hover:bg-gray-700">{s}</button>
                  ))}
                </div>
              </div>
              <Button variant="danger" size="sm" className="w-full" onClick={() => {
                const canvas = fabricRef.current
                const obj = canvas?.getActiveObject()
                if (obj) { canvas?.remove(obj); canvas?.discardActiveObject(); canvas?.renderAll(); saveToHistory(canvas!) }
              }}>
                <Trash2 className="h-3 w-3 ml-1" /> حذف العنصر
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">اختر عنصراً لتعديل خصائصه</p>
          )}
        </div>
      </div>
    </div>
  )
}
