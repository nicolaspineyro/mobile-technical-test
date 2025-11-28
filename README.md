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
            - Why: State must be correct before rendering anything; otherwise, you fight UI bugs that are really parsing/state issues.

      3. Text-Only Chat UI
            - Once parsing + state were solid, I added a minimal UI using FlashList.
            - Streamed text only, tested scrolling, auto-stick-to-bottom, and entrance animations.
            - Why: Isolate UI performance concerns early, without component-assembly noise.

      4. Dynamic Component System 
            - Next, I layered in complex message types using a component registry.
            - Added one at a time: contact badge → calendar event.
            - Verified field-by-field assembly.

      5. Final Polish Layer
            - After everything worked in isolation, I added refinement:
            - Reanimated entrance transitions
            - Loading placeholders
            - Incomplete-component guards
            - Why: Animation and UX polish only matter once the underlying system is well placed.

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

- When firing onLongPress on Component Cards, it displays BottomSheetComponent (reusable):

      1. Add Contact to Native Contacts App
      2. Share Contact natively anywhere else
      3. Add event to Native Calendar App
      4. Share Event to Native Calendar App 
- Copy to clipboard reusable logic
- Link to the email native app if pressing in the email
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

## UX/UI Decisions

Progressive text display: 4-char streaming appears instant, with fade-in animation

Components only render when complete: avoids broken UI and placeholder issues

Animations: Fade + SlideIn for messages, ZoomIn for components

Auto-scroll: Respects the user's current scroll position, only auto-scrolls when at the bottom

Responsiveness: Flexbox ensures components scale across screen sizes

Animation Choices

Minimal animations and details, micro interactions give a quality sensation, make you want to use the product more.

  - Text chunks: no animation per chunk; direct append + subtle fade-in on message start

  - Message entrance: slide up + fade-in

  - Component appearance: skeleton + fade on completion

  -  Performance: all animations on UI thread via Reanimated 4


##  Technical Decisions & Justifications
<table>
  <tr>
    <th>Area</th>
    <th>Decision</th>
    <th>Why</th>
  </tr>
  <tr>
    <td>State Management</td>
    <td>useReducer</td>
    <td>Better for complex state cases, all business logic in one place, message assembly efficiently; tracks building → complete; easier to test</td>
  </tr>
  <tr>
    <td>SSE Client</td>
    <td>react-native-sse</td>
    <td>Native fetch with ReadableStream issues in RN; handles cleanup and reconnections</td>
  </tr>
  <tr>
    <td>Dynamic System</td>
    <td>Factory + Registry</td>
    <td>Extensible for new component types, avoids giant switch cases, ensures type safety</td>
  </tr>
  <tr>
    <td>List Rendering</td>
    <td>FlashList + memoization</td>
    <td>Smooth scrolling for conversations; avoids re-renders</td>
  </tr>
  <tr>
    <td>Animations</td>
    <td>Reanimated 4</td>
    <td>Runs on UI thread, high performance, smooth streaming experience</td>
  </tr>
  <tr>
    <td>Error Handling</td>
    <td>try/catch + incomplete component checks</td>
    <td>Prevents crashes, logs errors, renders only complete components</td>
  </tr>
</table>

# Strategic Enhancements for the Chat Experience

Three areas of expansion align cleanly with the current architecture:

## **1. Calendar Awareness (expo-calendar)**
**What we add:**  
- We already are writing events, but we can also read events, detect availability, and warn about conflicts  
- Suggest ideal meeting times  
- Render event suggestion cards  

## **2. Smart Reminders (expo-notifications)**
**What we add:**  
- Auto-created reminder cards  
- Follow-ups, recurring alerts  
- Confirmation and overdue prompts  

**Why:**  
Low development effort, strong retention driver.  

## **3. Document & Email Summaries (expo-document-picker)**
**What we add:**  
- Upload PDFs/docs  
- Summaries with deadlines + tasks  
- One-tap “Add to calendar” or “Create reminder.”  

## **4. Contacts & Phone Actions (expo-contacts, Linking)**
**What we add:**  
- Contact-aware cards  
- Call / SMS / Email / WhatsApp actions  
- Auto-suggest actions for known people  

## **5. File Cards (expo-file-system)**
**What we add:**  
- File uploads with previews  
- Auto-tagging (invoice, receipt, contract)  
- Suggested next actions  

## **6. Deep App Linking (Linking, IntentLauncher)**
**What we add:**  
- Open Maps with coordinates  
- Prefilled email drafts  
- One-tap WhatsApp messages  
- Calendar deep links  

## **7. Screenshot / Image Intelligence (expo-image-picker)**
**What we add:**  
- Screenshot uploads  
- Extract dates, tasks, commitments  
- Produce actionable cards  

**Why:**  
Mobile users think in screenshots more than documents.  

**Example:**  
Screenshot of WhatsApp → assistant extracts “meeting tomorrow 4pm”.

## **8. SMS Parsing (OS share sheet)**
**What we add:**  
- Share SMS → extract codes, deadlines, reminders  
- Auto-create task/reminder cards  

## **9. Daily Digest (Background Fetch)**
**What we add:**  
- Summary card of today’s tasks, events, and reminders  
- “What changed overnight?” updates  

# **Extra Add-On Ideas**

## **10. Voice Notes → Structured Insights (expo-av + transcription)**
Voice memo becomes tasks, reminders, or meeting summaries.

## **11. Contact-Aware Smart Replies**
Mention a contact → assistant proposes reply drafts or meeting prompts.

## **12. In-Chat Mini Dashboards**
Component-driven summaries for sales, KPIs, or budgets.

