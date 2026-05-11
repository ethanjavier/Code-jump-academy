import { Segmented } from 'antd'

import { useI18n } from '../i18n/I18nContext'

type Props = {
  value: 'learn' | 'practice'
  onLearn: () => void
  onPractice: () => void
  /** No programming tracks selected on Home — only Blocks campaign is available. */
  practiceDisabled?: boolean
}

export function LearnPracticeModeToggle({
  value,
  onLearn,
  onPractice,
  practiceDisabled,
}: Props) {
  const { t } = useI18n()
  return (
    <Segmented
      size="small"
      aria-label={t('header.modeToggleAria')}
      className="font-display shrink-0 [&_.ant-segmented-item-selected]:!bg-indigo-600 [&_.ant-segmented-item-selected]:!text-white [&_.ant-segmented-thumb]:!bg-indigo-600"
      options={[
        { label: t('header.modeLearn'), value: 'learn' },
        { label: t('header.modePractice'), value: 'practice', disabled: practiceDisabled === true },
      ]}
      value={value}
      onChange={(v) => {
        if (v === 'learn') onLearn()
        else onPractice()
      }}
    />
  )
}
