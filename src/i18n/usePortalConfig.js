import { useMemo } from 'react'
import { portalConfig as baseConfig } from '../data/parentPortal'
import { useLanguage } from './LanguageContext'
import { getCatalog } from './translations'
import { toWesternDigits } from '../utils/localeFormat'
import { localizeLatinTermsForUrdu } from '../utils/urduLatinTerms'

function urduLabel(text, locale) {
  if (locale !== 'ur') return text
  return localizeLatinTermsForUrdu(toWesternDigits(text))
}

function mapLabels(items, labelMap, locale) {
  return items.map((item) => {
    const label = labelMap[item.id] ?? item.label
    return {
      ...item,
      label: urduLabel(label, locale),
    }
  })
}

export function usePortalConfig() {
  const { locale } = useLanguage()

  return useMemo(() => {
    const pc = getCatalog(locale).portalConfig
    const roles = {}
    Object.keys(baseConfig.roles).forEach((key) => {
      const label = pc.roles[key] ?? baseConfig.roles[key].label
      roles[key] = {
        ...baseConfig.roles[key],
        label: urduLabel(label, locale),
      }
    })

    return {
      ...baseConfig,
      roles,
      concernCategories: mapLabels(baseConfig.concernCategories, pc.concernCategories, locale),
      urgencyLevels: mapLabels(baseConfig.urgencyLevels, pc.urgencyLevels, locale),
      concernStatuses: mapLabels(baseConfig.concernStatuses, pc.concernStatuses, locale),
      meetingStatuses: mapLabels(baseConfig.meetingStatuses, pc.meetingStatuses, locale),
      grades: baseConfig.grades.map((g) => {
        const label = pc.grades.replace('{{n}}', g.id)
        return {
          ...g,
          label: urduLabel(label, locale),
        }
      }),
      subjects: baseConfig.subjects.map((s) => urduLabel(pc.subjects[s] ?? s, locale)),
      tuitionRequestTypes: mapLabels(baseConfig.tuitionRequestTypes, pc.tuitionRequestTypes, locale),
      tuitionStatuses: mapLabels(baseConfig.tuitionStatuses, pc.tuitionStatuses, locale),
      guidancePriorities: mapLabels(baseConfig.guidancePriorities, pc.guidancePriorities, locale),
    }
  }, [locale])
}

export function labelForConfig(list, id, t, prefix) {
  const fromT = t(`${prefix}.${id}`)
  if (fromT && fromT !== `${prefix}.${id}`) return fromT
  return list.find((item) => item.id === id)?.label || id
}
