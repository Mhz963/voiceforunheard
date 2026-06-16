import {
  FaHeadphones,
  FaMicrophone,
  FaBook,
  FaHands,
  FaBookOpen,
  FaComments,
  FaBaby,
  FaVolumeUp,
  FaAssistiveListeningSystems,
  FaGraduationCap,
  FaBriefcase,
  FaChild,
  FaShapes,
  FaUserGraduate,
  FaUserTie,
  FaBrain,
  FaHome,
  FaExclamationTriangle,
  FaChartLine,
  FaBullseye,
  FaHandshake,
  FaGlobe,
  FaLayerGroup,
  FaUsers,
  FaChalkboardTeacher,
  FaUniversalAccess,
} from 'react-icons/fa'
import { FaEarListen } from 'react-icons/fa6'

const programIcons = {
  'auditory-verbal': FaHeadphones,
  articulation: FaMicrophone,
  'language-development': FaBook,
  'sign-language': FaHands,
  'listening-skills': FaEarListen,
  literacy: FaBookOpen,
  'social-communication': FaComments,
  'early-intervention': FaBaby,
  'cochlear-implant': FaVolumeUp,
  'hearing-aid': FaAssistiveListeningSystems,
  transition: FaGraduationCap,
  'adult-rehab': FaBriefcase,
}

const ageGroupIcons = {
  infants: FaBaby,
  toddlers: FaChild,
  preschool: FaShapes,
  'school-age': FaBookOpen,
  adolescents: FaUserGraduate,
  adults: FaUserTie,
}

const impactIcons = {
  communication: FaComments,
  cognition: FaBrain,
  isolation: FaHome,
  education: FaBook,
}

const advantageIcons = {
  educator: FaChalkboardTeacher,
  categories: FaLayerGroup,
  ages: FaUsers,
  family: FaHandshake,
  analytics: FaChartLine,
  inclusive: FaUniversalAccess,
  accessibility: FaUniversalAccess,
  evidence: FaChartLine,
}

const philosophyIcons = {
  classroom: FaBullseye,
  family: FaHandshake,
  inclusive: FaGlobe,
}

export function getProgramIcon(id) {
  return programIcons[id] || FaBook
}

export function getAgeGroupIcon(id) {
  return ageGroupIcons[id] || FaUsers
}

export function getImpactIcon(key) {
  return impactIcons[key] || FaComments
}

export function getAdvantageIcon(key) {
  return advantageIcons[key] || FaChalkboardTeacher
}

export function getPhilosophyIcon(key) {
  return philosophyIcons[key] || FaBullseye
}

export { FaChartLine, FaExclamationTriangle, FaLayerGroup }
