# 📊 MedGenius AI - Visual Flowcharts

## System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    MEDGENIUS AI SYSTEM                       │
│                                                              │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐          │
│  │  Users   │─────>│ Frontend │─────>│ Backend  │          │
│  │ (Browser)│<─────│(React App)│<─────│(Node.js) │          │
│  └──────────┘      └──────────┘      └────┬─────┘          │
│                                            │                 │
│                    ┌───────────────────────┼────────┐        │
│                    │                       │        │        │
│              ┌─────▼─────┐         ┌──────▼───┐ ┌─▼────┐   │
│              │  MongoDB  │         │ Groq AI  │ │ FDA  │   │
│              │  Database │         │ (LLaMA)  │ │ API  │   │
│              └───────────┘         └──────────┘ └──────┘   │
└──────────────────────────────────────────────────────────────┘
```

## User Role Flow

```
                    ┌─────────────┐
                    │   LOGIN     │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
      │ Lab Admin │  │ Doctor  │  │  Patient  │
      └─────┬─────┘  └────┬────┘  └─────┬─────┘
            │             │              │
            ▼             ▼              ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────┐
    │Lab Dashboard │ │  Doctor  │ │ Patient  │
    │              │ │Dashboard │ │  Portal  │
    └──────────────┘ └──────────┘ └──────────┘
```


## Lab Admin Complete Workflow

```
START
  │
  ▼
┌─────────────────┐
│ Login to System │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lab Dashboard   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upload Report   │
│ Button Click    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fill Patient    │
│ Information     │
│ - Name          │
│ - Age           │
│ - Gender        │
│ - Test Type     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upload File OR  │
│ Enter Data      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Click "Run AI   │
│ Analysis"       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Processing   │
│ (5-10 seconds)  │
│                 │
│ Agent 1: Report │
│ Agent 2: QC     │
│ Agent 3: Disease│
│ Agent 4: Med    │
│ Agent 5: Care   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ View Results    │
│ - Summary       │
│ - Diagnosis     │
│ - Risks         │
│ - Recommendations│
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Assign │ │  Save  │
│ Doctor │ │ Report │
└────────┘ └───┬────┘
               │
               ▼
          ┌─────────┐
          │  Done   │
          └─────────┘
```

## Doctor Review Workflow

```
START
  │
  ▼
┌──────────────────┐
│ Login to System  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Doctor Dashboard │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ View Pending     │
│ Patient Queue    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Select Patient   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Review 5 Tabs:   │
│                  │
│ 1. Overview      │
│ 2. Lab Results   │
│ 3. Diagnosis     │
│ 4. Risks         │
│ 5. Medications   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Analyze Data     │
│ - Health Score   │
│ - Biomarkers     │
│ - AI Insights    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create Treatment │
│ Plan             │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Schedule         │
│ Follow-up        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Approve & Send   │
│ to Patient       │
└────────┬─────────┘
         │
         ▼
    ┌─────────┐
    │  Done   │
    └─────────┘
```

## Patient Portal Workflow

```
START
  │
  ▼
┌──────────────────┐
│ Login to System  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Patient Portal   │
│ Dashboard        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ View Health      │
│ Score & Trends   │
└────────┬─────────┘
         │
         ▼
    ┌────┴────┐
    │ Choose  │
    │ Feature │
    └────┬────┘
         │
    ┌────┼────┬────┬────┬────┬────┐
    │    │    │    │    │    │    │
    ▼    ▼    ▼    ▼    ▼    ▼    ▼
┌──────┐ │  │  │  │  │  │  │
│Health│ │  │  │  │  │  │  │
│Records│ │  │  │  │  │  │  │
└──┬───┘ │  │  │  │  │  │  │
   │     │  │  │  │  │  │  │
   ▼     │  │  │  │  │  │  │
┌──────┐ │  │  │  │  │  │  │
│View  │ │  │  │  │  │  │  │
│Report│ │  │  │  │  │  │  │
└──┬───┘ │  │  │  │  │  │  │
   │     │  │  │  │  │  │  │
   ▼     ▼  ▼  ▼  ▼  ▼  ▼  ▼
┌──────────────────────────┐
│ Download PDF             │
└──────────────────────────┘
```

## AI Analysis Pipeline

```
┌──────────────────┐
│ Lab Report Input │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Data Extraction  │
│ & Parsing        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│      AI AGENT ORCHESTRATION          │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Agent 1: Report Generation     │ │
│  │ • Parse raw data               │ │
│  │ • Structure information        │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │ Agent 2: Quality Control       │ │
│  │ • Validate accuracy            │ │
│  │ • Check anomalies              │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │ Agent 3: Disease Prediction    │ │
│  │ • Analyze biomarker velocity   │ │
│  │ • Predict 6-12 month risks     │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │ Agent 4: Med Safety            │ │
│  │ • Check drug interactions      │ │
│  │ • Query FDA database           │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
│  ┌──────────────▼─────────────────┐ │
│  │ Agent 5: Care Coordinator      │ │
│  │ • Synthesize insights          │ │
│  │ • Create action plan           │ │
│  └──────────────┬─────────────────┘ │
│                 │                    │
└─────────────────┼────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Save to        │
         │ Database +     │
         │ Blockchain     │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌────────────────┐ ┌────────────────┐
│ Notify Doctor  │ │ Notify Patient │
└────────────────┘ └────────────────┘
```

---

**For complete details, see USER_GUIDE.md**
