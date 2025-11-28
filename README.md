# The Mobile First Company Challenge

<table>
  <tr>
    <th>iOS</th>
    <th>Android</th>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/2fe91797-20b8-4c05-a0d8-0938825a1fbc" height="500"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/9fd1f6b1-5adb-4122-addd-796153c65b4a" height="500"/>
    </td>
  </tr>
</table>

This challenge consists of building a **real-time AI chat experience** featuring:

### Real-time streaming

Assistant messages stream in live (4 chars per chunk)

### Structured SSE UI components

The assistant can send UI components field-by-field (e.g., `contact_badge`, `calendar_event`), and the app assembles them progressively until complete.

### High-performance rendering

The chat uses:

* `FlashList` for efficient rendering
* A reducer state management flow

### Smooth UX

* Fade/slide-in for new bubbles
* Fade-in for completed components
* Auto-scroll to the latest messages
* Minimal, clean design

## Architecture Overview

```
Presentation Layer (Chat UI Components)
       ↓ ↑
State Management Layer (useReducer)
       ↓ ↑
Streaming Layer (Event Parsing + Assembly)
       ↓ ↑
Network Layer (SSE Connection)
```

### Key Concepts

* Messages are built incrementally:
  * text: 4-char chunks
  * components: field-by-field
* Reducer tracks message lifecycle: *building → complete*
* Components render only when all required fields arrive
* SSE hook manages connection, reconnection, and cleanup

---

## Strategy 
I split the project into independent systems and built each one in isolation before integrating them. This avoided complexity blow-ups and made debugging easier.

      1- SSE Client (no UI)
            - I built the streaming layer first: a custom hook using react-native-sse.
            - Logged raw events, validated parsing, ensured cleanup with AbortController, and tested reconnection.
            - Why: You can’t build message logic or UI until you know the stream behaves reliably.

      2. Message State Management
            - With streaming in place, I implemented a useReducer to handle complex state actions for text chunks, component fields, and completion.
            - Used mock events first to verify assembly logic deterministically.
            - Why: State must be correct before rendering anything; otherwise you fight UI bugs that are really parsing/state issues.

      3. Text-Only Chat UI
            - Once parsing + state were solid, I added a minimal UI using FlashList.
            - Streamed text only, tested scrolling, auto-stick-to-bottom, and entrance animations.
            - Why: Isolate UI performance concerns early, without component-assembly noise.

      4. Dynamic Component System 
            - Next, I layered in complex message types using a component registry.
            - Added one at a time: contact badge → calendar event.
            - Verified field-by-field assembly and “ready to render” logic.

      5. Final Polish Layer
            - After everything worked in isolation, I added refinement:
            - Reanimated entrance transitions
            - Error states
            - Loading placeholders
            - Incomplete-component guards
            - Why: Animation and UX polish only matter once the underlying system is solid.

## Running the App

### 1. Clone the repo

```bash
git clone https://github.com/nicolaspineyro/mobile-technical-test
cd mobile-technical-test
npm install
```

### 2. Start the Expo server

```bash
npx expo start
```

### 3. Open the app in Expo Go

You will land on the demo screen

![ScreenRecording2025-11-28at11 15 51AM-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/172ac661-4b59-48bb-92df-d806fd008c5f)


Read the instructions and press Start to access to Playground.

## Notes SSE

SSE connections are manually triggered by the **Play** and **Stop**buttons. This is intentional because the stream repeats the same sequence over and over, for the sake of testing the UI  autoconnect and reconnect on mount are not enabled.

## Project Structure

```
mobile-technical-test
├── app // screens and navigation layer
├── assets 
├── components  // presentational layer
│   ├── chat
│   │   └── list
│   ├── icons
│   └── ui
│       └── bottom-sheet
├── hooks  // sse managament layer
├── reducers // state management layer
├── theme
├── types
└── utils

```

## Features

- When firing onLongPress on Component Cards desplegates BottomSheetComponent (reusable):

      1. Add Contact to Native Contacts App
      2. Share Contact natively anywhere else
      3. Add event to Native Calendar App
      4. Share Event to Native Calendar App 
- Copy to clipboard reusable logic
- Link to email native app if pressing in email
- Text selection across the chat bubbles.
<table>
  <tr>
    <th>iOS</th>
    <th>Android</th>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/0b093f62-c00f-4bc3-8ff3-55a37fdc540b" height="500"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/5be05975-23e3-47d9-88c0-a862ffb2bc7c" height="500"/>
    </td>
  </tr>
</table>


