import { InputNumber, Segmented, Select, Tag } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Boxes, Braces, Crosshair, GripVertical, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { PaletteEntry } from './constants'
import { iconStroke } from './icons'
import { BLOCK_OPTIONS, COLOR_META } from './constants'
import { useI18n } from '../i18n/I18nContext'
import type { BlockNode, ColorKey, CountSource } from '../engine/blocks'
import { clampRepeatCount } from '../engine/blocks'
import { formatCountLabel } from './helpers'

function translateGroup(group: string, t: (k: string) => string): string {
  if (group === 'Acciones') return t('palette.groupActions')
  if (group === 'Control') return t('palette.groupControl')
  if (group === 'Valores') return t('palette.groupValues')
  return group
}

function paletteDescription(id: string, t: (k: string, vars?: Record<string, string | number>) => string): string {
  if (id === 'newLine') return t('palette.newLine.desc')
  if (id === 'skip') return t('palette.skip.desc')
  if (id === 'repeat') return t('palette.repeat.desc')
  if (id === 'varDecl') return t('palette.varDecl.desc')
  if (id.startsWith('drawBox:')) {
    const color = id.split(':')[1] as ColorKey
    const colorLabel = t(`color.${color}`)
    return t('palette.drawBox.desc', { color: colorLabel })
  }
  return ''
}

// eslint-disable-next-line react-refresh/only-export-components -- re-export consumed by `./App`
export { formatCountLabel } from './helpers'

export function CursorBadge({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${
        active
          ? 'border border-indigo-400/40 bg-indigo-950/80 text-indigo-100 ring-1 ring-indigo-500/30'
          : 'border border-slate-600 bg-slate-800/90 text-slate-400'
      }`}
    >
      <Crosshair className="size-3.5 shrink-0" strokeWidth={iconStroke.medium} aria-hidden />
      {label}
    </span>
  )
}

export function BlockPalette({
  allowed,
  onPick,
  disabled,
}: {
  allowed: Set<string>
  onPick: (blockId: string) => void
  disabled: boolean
}) {
  const { t } = useI18n()
  const visible = BLOCK_OPTIONS.filter((b) => allowed.has(b.id))
  const groups = new Map<string, PaletteEntry[]>()
  for (const b of visible) {
    const arr = groups.get(b.group) ?? []
    arr.push(b)
    groups.set(b.group, arr)
  }

  const orderedGroups = [...groups.entries()]

  return (
    <div className="space-y-4 md:space-y-5">
      {orderedGroups.map(([group, items]) => (
        <div key={group}>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Boxes className="size-3.5 shrink-0 text-violet-400/90" strokeWidth={iconStroke.soft} aria-hidden />
            {translateGroup(group, t)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((b) => (
              <motion.button
                key={b.id}
                type="button"
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.03 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                onClick={() => onPick(b.id)}
                className="flex flex-col items-start rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/35 via-violet-600/25 to-slate-900/90 px-3 py-2.5 text-left text-sm text-slate-100 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400/20 transition hover:border-fuchsia-400/35 hover:from-indigo-500/45 hover:via-violet-500/35 hover:shadow-indigo-900/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="font-code text-xs font-medium text-indigo-300">{b.label}</span>
                <span className="text-[11px] text-slate-400">{paletteDescription(b.id, t)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyWorkspaceHint() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[140px] flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-400/40 bg-gradient-to-b from-indigo-950/40 to-slate-950/70 px-4 py-8 text-center ring-1 ring-violet-500/25"
    >
      <Braces className="mb-2 size-9 text-indigo-400" strokeWidth={iconStroke.soft} aria-hidden />
      <p className="text-sm font-medium text-slate-100">{t('blocks.emptyTitle')}</p>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{t('blocks.emptyBody')}</p>
    </motion.div>
  )
}

const REPEAT_LITERAL_OPTIONS = Array.from({ length: 11 }, (_, i) => i + 2).map((n) => ({
  value: n,
  label: `${n}×`,
}))

const VAR_DRAG_TYPE = 'application/x-codejump-var'

function VarNameDragPick({
  value,
  options,
  onChange,
  disabled,
  compact,
}: {
  value: string
  options: readonly string[]
  onChange: (name: string) => void
  disabled?: boolean
  compact?: boolean
}) {
  const { t } = useI18n()
  const list = useMemo(
    () => (options.length > 0 ? [...options] : [value || 'n']),
    [options, value],
  )
  const current = list.includes(value) ? value : list[0]!
  const [slotOver, setSlotOver] = useState(false)

  useEffect(() => {
    if (disabled || options.length === 0) return
    if (!options.includes(value)) onChange(options[0]!)
  }, [disabled, value, options, onChange])

  const chipCls = compact
    ? 'flex items-center gap-1 rounded-lg border border-indigo-500/35 bg-indigo-950/45 px-2 py-0.5 font-mono text-[11px] font-medium text-indigo-100 shadow-sm transition hover:border-indigo-400/60 hover:bg-indigo-900/55 disabled:cursor-not-allowed disabled:opacity-40'
    : 'flex items-center gap-1 rounded-lg border border-indigo-500/35 bg-indigo-950/45 px-2.5 py-1 font-mono text-xs font-medium text-indigo-100 shadow-sm transition hover:border-indigo-400/60 hover:bg-indigo-900/55 disabled:cursor-not-allowed disabled:opacity-40'

  const slotCls = compact
    ? `flex min-h-[26px] min-w-[68px] shrink-0 items-center justify-center rounded-lg border px-2 font-mono text-[11px] transition ${
        slotOver ? 'border-emerald-400 bg-emerald-950/45 ring-1 ring-emerald-500/30' : 'border-slate-600 bg-slate-950/90'
      }`
    : `flex min-h-[30px] min-w-[80px] shrink-0 items-center justify-center rounded-lg border px-2 py-0.5 font-mono text-xs transition ${
        slotOver ? 'border-emerald-400 bg-emerald-950/45 ring-1 ring-emerald-500/30' : 'border-slate-600 bg-slate-950/90'
      }`

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <div
          className={slotCls}
          aria-label={t('blocks.varDropTarget')}
          onDragOver={(e) => {
            if (disabled) return
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
          }}
          onDragEnter={(e) => {
            if (disabled) return
            e.preventDefault()
            setSlotOver(true)
          }}
          onDragLeave={() => setSlotOver(false)}
          onDrop={(e) => {
            if (disabled) return
            e.preventDefault()
            setSlotOver(false)
            const name =
              e.dataTransfer.getData(VAR_DRAG_TYPE) ||
              e.dataTransfer.getData('text/plain').trim()
            if (name && list.includes(name)) onChange(name)
          }}
        >
          <span className="text-emerald-200/95">{current}</span>
        </div>
        <div className="flex min-w-0 flex-wrap gap-1">
          {list.map((n) => (
            <button
              key={n}
              type="button"
              draggable={!disabled}
              disabled={disabled}
              onDragStart={(e) => {
                e.dataTransfer.setData(VAR_DRAG_TYPE, n)
                e.dataTransfer.setData('text/plain', n)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              onClick={() => !disabled && onChange(n)}
              className={chipCls}
            >
              <GripVertical className="size-3 shrink-0 text-indigo-400/80" strokeWidth={iconStroke.medium} aria-hidden />
              {n}
            </button>
          ))}
        </div>
      </div>
      <span className="text-[10px] leading-tight text-slate-500">{t('blocks.varOptionsHint')}</span>
    </div>
  )
}

export function BlockListView({
  nodes,
  depth,
  onRemove,
  onChangeRepeatCountSource,
  onUpdateVarDecl,
  activeInsertId,
  onSelectRepeat,
  varNameOptions,
}: {
  nodes: BlockNode[]
  depth: number
  onRemove: (id: string) => void
  onChangeRepeatCountSource: (id: string, source: CountSource) => void
  onUpdateVarDecl: (id: string, patch: Partial<{ name: string; initial: number }>) => void
  activeInsertId: 'root' | string
  onSelectRepeat: (id: string) => void
  varNameOptions: string[]
}) {
  const { t } = useI18n()
  return (
    <ul className={`space-y-2 ${depth > 0 ? 'border-l border-indigo-500/25 pl-3' : ''}`}>
      <AnimatePresence initial={false}>
        {nodes.map((node, idx) => (
          <motion.li
            key={node.id}
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [0, 1.1, 1],
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 520, damping: 16 },
              layout: { type: 'spring', stiffness: 380, damping: 28 },
            }}
            className={`rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-slate-900/95 via-indigo-950/55 to-slate-950/95 shadow-lg shadow-violet-950/30 ring-1 ring-white/5 ${
              node.kind === 'repeat' && activeInsertId === node.id
                ? 'border-emerald-400/70 ring-2 ring-emerald-400/40'
                : ''
            }`}
          >
            <div
              role={node.kind === 'repeat' ? 'button' : undefined}
              tabIndex={node.kind === 'repeat' ? 0 : undefined}
              onClick={
                node.kind === 'repeat' ? () => onSelectRepeat(node.id) : undefined
              }
              onKeyDown={
                node.kind === 'repeat'
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelectRepeat(node.id)
                      }
                    }
                  : undefined
              }
              className={`flex flex-wrap items-center gap-2 px-3 py-2 ${
                node.kind === 'repeat'
                  ? 'cursor-pointer select-none hover:bg-slate-800/70'
                  : ''
              }`}
            >
              <Tag
                color={
                  activeInsertId === node.id && node.kind === 'repeat' ? 'geekblue' : 'default'
                }
                className="m-0 border-none font-mono text-[11px]"
              >
                {idx + 1}
              </Tag>

              {node.kind === 'varDecl' && (
                <div
                  className="flex flex-wrap items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <span className="shrink-0 font-mono text-xs text-emerald-400">{t('blocks.varKeyword')}</span>
                  <VarNameDragPick
                    compact
                    value={node.name}
                    options={varNameOptions}
                    onChange={(name) => onUpdateVarDecl(node.id, { name })}
                  />
                  <span className="shrink-0 text-[11px] text-slate-500">=</span>
                  <InputNumber
                    size="small"
                    min={2}
                    max={12}
                    value={clampRepeatCount(node.initial)}
                    onChange={(val) =>
                      val != null &&
                      onUpdateVarDecl(node.id, { initial: clampRepeatCount(Number(val)) })
                    }
                  />
                </div>
              )}

              {node.kind === 'drawBox' && (
                <>
                  <span className="font-code text-xs text-indigo-200">
                    drawBox(&quot;{node.color}&quot;)
                  </span>
                  <span
                    className={`inline-block size-3 rounded-full ${COLOR_META[node.color].dotClass}`}
                    aria-hidden
                  />
                </>
              )}
              {node.kind === 'newLine' && (
                <span className="font-code text-xs text-indigo-200">newLine()</span>
              )}
              {node.kind === 'skip' && (
                <span className="font-code text-xs text-slate-300">
                  skip()
                  <span
                    className="ml-2 inline-block rounded-md border border-dashed border-slate-500 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400"
                    title="Sin pintar"
                  >
                    vacío
                  </span>
                </span>
              )}
              {node.kind === 'repeat' && (
                <div
                  className="flex flex-wrap items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <span className="font-code text-xs text-indigo-200">Repetir</span>
                  <Segmented
                    size="small"
                    options={[
                      { label: t('blocks.segmentNumber'), value: 'literal' },
                      { label: t('blocks.segmentVariable'), value: 'var' },
                    ]}
                    value={node.count.type === 'literal' ? 'literal' : 'var'}
                    onChange={(v) => {
                      if (v === 'literal') {
                        const current =
                          node.count.type === 'literal' ? node.count.value : 3
                        onChangeRepeatCountSource(node.id, {
                          type: 'literal',
                          value: clampRepeatCount(current),
                        })
                      } else {
                        const nm =
                          node.count.type === 'var'
                            ? node.count.name
                            : (varNameOptions[0] ?? 'n')
                        onChangeRepeatCountSource(node.id, { type: 'var', name: nm })
                      }
                    }}
                  />
                  {node.count.type === 'literal' ? (
                    <Select
                      size="small"
                      value={node.count.value}
                      className="min-w-[80px]"
                      options={REPEAT_LITERAL_OPTIONS}
                      onChange={(v) =>
                        onChangeRepeatCountSource(node.id, {
                          type: 'literal',
                          value: clampRepeatCount(Number(v)),
                        })
                      }
                    />
                  ) : (
                    <VarNameDragPick
                      compact
                      value={
                        varNameOptions.includes(node.count.name)
                          ? node.count.name
                          : (varNameOptions[0] ?? node.count.name)
                      }
                      options={varNameOptions}
                      onChange={(name) =>
                        onChangeRepeatCountSource(node.id, { type: 'var', name })
                      }
                      disabled={varNameOptions.length === 0}
                    />
                  )}
                  <Tag className="m-0 font-mono text-[11px]">{formatCountLabel(node.count)}</Tag>
                </div>
              )}

              <motion.button
                type="button"
                aria-label={t('blocks.deleteBlock')}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(node.id)
                }}
                className="ml-auto rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-950/80 hover:text-rose-300"
              >
                <Trash2 className="size-4" strokeWidth={iconStroke.medium} aria-hidden />
              </motion.button>
            </div>
            {node.kind === 'repeat' && (
              <div className="border-t border-slate-700/90 bg-slate-950/50 px-2 py-2">
                {node.children.length === 0 ? (
                  <p className="px-2 py-3 text-center text-[11px] text-slate-500">
                    {t('blocks.repeatEmpty')}
                  </p>
                ) : (
                  <BlockListView
                    nodes={node.children}
                    depth={depth + 1}
                    onRemove={onRemove}
                    onChangeRepeatCountSource={onChangeRepeatCountSource}
                    onUpdateVarDecl={onUpdateVarDecl}
                    activeInsertId={activeInsertId}
                    onSelectRepeat={onSelectRepeat}
                    varNameOptions={varNameOptions}
                  />
                )}
              </div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
