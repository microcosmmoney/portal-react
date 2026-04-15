"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: { length: number; [index: number]: { isFinal: boolean; [index: number]: { transcript: string } } }
}

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isRecordingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const Ctor = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition
    if (!Ctor) return

    const instance = new Ctor()
    instance.continuous = true
    instance.interimResults = true
    instance.lang = "zh-CN"
    instance.onresult = (event) => {
      let finalTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) onTranscript(finalTranscript)
    }
    instance.onerror = () => {}
    instance.onend = () => {
      if (isRecordingRef.current) {
        try { instance.start() } catch {}
      }
    }
    recognitionRef.current = instance

    return () => {
      instance.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [onTranscript])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      isRecordingRef.current = true
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000)
    } catch {}
  }, [])

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false
    recognitionRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording()
    else startRecording()
  }, [isRecording, startRecording, stopRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return { isRecording, recordingTime, toggleRecording, formatTime }
}
