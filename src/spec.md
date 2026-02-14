# Specification

## Summary
**Goal:** Make LIA’s text-to-speech (TTS) reliably speak only newly generated assistant responses (not restored history), and handle unsupported browsers gracefully.

**Planned changes:**
- Update the frontend TTS trigger logic to detect and speak only newly generated assistant messages, avoiding auto-speaking when conversation history is loaded/restored.
- Ensure only the latest assistant message is spoken when multiple messages arrive quickly by cancelling any in-progress speech and keeping the speaking state accurate.
- Preserve and verify the existing “Stop Speaking” control to immediately cancel current speech.
- Add a non-blocking informational notice in Settings when `window.speechSynthesis` is unavailable, while keeping message display fully functional.

**User-visible outcome:** On app load, LIA stays silent for past messages; when the user sends a message and receives a new assistant reply, LIA speaks it (if enabled). If the browser lacks Speech Synthesis, Settings clearly indicates voice output isn’t supported without breaking chat.
