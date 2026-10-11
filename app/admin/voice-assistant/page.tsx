import type { Metadata } from 'next'
import VoiceAssistant from './VoiceAssistant'

export const metadata: Metadata = {
  title: 'Voice Asistan · Neslihan Hanım',
  robots: { index: false, follow: false },
}

export default function VoiceAssistantPage() {
  return <VoiceAssistant />
}
