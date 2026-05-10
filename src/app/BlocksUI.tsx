import { InputNumber, Segmented, Select, Tag } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, MousePointerClick, Sparkles, Trash2 } from 'lucide-react'

import type { PaletteEntry } from './constants'
import { BLOCK_OPTIONS, COLOR_META } from './constants'
import { formatCountLabel } from './helpers'
import type { BlockNode, CountSource } from '../engine/blocks'
import { clampRepeatCount } from '../engine/blocks'

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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? 'bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-400/40'
          : 'bg-slate-800 text-slate-400'
      }`}
    >
      <MousePointerClick className="size-3.5" aria-hidden />
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
  const visible = BLOCK_OPTIONS.filter((b) => allowed.has(b.id))
  const groups = new Map<string, PaletteEntry[]>()
  for (const b of visible) {
    const arr = groups.get(b.group) ?? []
    arr.push(b)
    groups.set(b.group, arr)
  }

  const orderedGroups = [...groups.entries()]

  return (
    <div className="space-y-5">
      {orderedGroups.map(([group, items]) => (
        <div key={group}>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Layers className="size-3.5" aria-hidden />
            {group}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((b) => (
              <motion.button
                key={b.id}
                type="button"
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.03 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                onClick={() => onPick(b.id)}
                className="flex flex-col items-start rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/35 via-violet-600/25 to-fuchsia-600/20 px-3 py-2.5 text-left text-sm text-slate-100 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400/25 transition hover:ring-indigo-300/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="font-code text-xs font-medium text-indigo-100">{b.label}</span>
                <span className="text-[11px] text-indigo-100/75">{b.description}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyWorkspaceHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[140px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-500/35 bg-slate-900/50 px-4 py-8 text-center"
    >
      <Sparkles className="mb-2 size-8 text-indigo-400/90" aria-hidden />
      <p className="text-sm font-medium text-slate-200">Tu código aparecerá aquí</p>
      <p className="mt-1 max-w-sm text-xs text-slate-400">
        Arrastra desde la paleta o haz clic para construir. Las variables declaradas van al pie del
        programa; dentro de Repetir puedes repetir usando un número o un nombre de variable definido
        arriba.
      </p>
    </motion.div>
  )
}

const REPEAT_LITERAL_OPTIONS = Array.from({ length: 11 }, (_, i) => i + 2).map((n) => ({
  value: n,
  label: `${n}×`,
}))

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
  return (
    <ul className={`space-y-2 ${depth > 0 ? 'border-l border-indigo-500/30 pl-3' : ''}`}>
      <AnimatePresence initial={false}>
        {nodes.map((node, idx) => (
          <motion.li
            key={node.id}
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [0, 1.12, 1],
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 460, damping: 14 },
              layout: { type: 'spring', stiffness: 380, damping: 28 },
            }}
            className={`rounded-3xl bg-gradient-to-br from-slate-900/70 to-indigo-950/50 ring-1 ring-indigo-500/25 ${
              node.kind === 'repeat' && activeInsertId === node.id
                ? 'ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
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
                  ? 'cursor-pointer select-none hover:bg-slate-800/60'
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
                  className="flex flex-wrap items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <span className="font-mono text-xs text-emerald-200">variable</span>
                  <Select
                    size="small"
                    className="min-w-[72px]"
                    value={node.name}
                    options={varNameOptions.map((n) => ({ value: n, label: n }))}
                    onChange={(v) => onUpdateVarDecl(node.id, { name: String(v) })}
                  />
                  <span className="text-[11px] text-slate-500">=</span>
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
                  <span className="font-code text-xs text-indigo-100">
                    drawBox(&quot;{node.color}&quot;)
                  </span>
                  <span
                    className={`inline-block size-3 rounded-full ${COLOR_META[node.color].dotClass}`}
                    aria-hidden
                  />
                </>
              )}
              {node.kind === 'newLine' && (
                <span className="font-code text-xs text-indigo-100">newLine()</span>
              )}
              {node.kind === 'skip' && (
                <span className="font-code text-xs text-slate-300">
                  skip()
                  <span
                    className="ml-2 inline-block rounded-md border border-dashed border-slate-500 bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-400"
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
                  <span className="font-code text-xs text-indigo-100">Repetir</span>
                  <Segmented
                    size="small"
                    options={[
                      { label: 'Número', value: 'literal' },
                      { label: 'Variable', value: 'var' },
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
                    <Select
                      size="small"
                      className="min-w-[88px]"
                      value={
                        varNameOptions.includes(node.count.name)
                          ? node.count.name
                          : (varNameOptions[0] ?? node.count.name)
                      }
                      options={varNameOptions.map((n) => ({ value: n, label: n }))}
                      onChange={(v) =>
                        onChangeRepeatCountSource(node.id, { type: 'var', name: String(v) })
                      }
                      disabled={varNameOptions.length === 0}
                    />
                  )}
                  <Tag className="m-0 font-mono text-[11px]">{formatCountLabel(node.count)}</Tag>
                </div>
              )}

              <motion.button
                type="button"
                aria-label="Eliminar bloque"
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(node.id)
                }}
                className="ml-auto rounded-2xl p-1.5 text-rose-400 transition hover:bg-rose-500/15 hover:text-rose-300"
              >
                <Trash2 className="size-4" aria-hidden />
              </motion.button>
            </div>
            {node.kind === 'repeat' && (
              <div className="border-t border-slate-700/70 bg-slate-950/40 px-2 py-2">
                {node.children.length === 0 ? (
                  <p className="px-2 py-3 text-center text-[11px] text-slate-500">
                    Selecciona este Repetir y añade bloques desde la paleta.
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
