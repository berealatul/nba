flowchart TD
A[Start] --> B[User Login/Authentication]
B --> C{User Role?}

    C -->|Faculty| F[Faculty Dashboard]
    C -->|HOD| H[HOD Dashboard]
    C -->|Office Staff| E[Staff Dashboard]
    C -->|Dean| D[Dean Dashboard]
    C -->|Admin| G[Admin Dashboard]

    F --> I[Select Course]
    I --> J[Map Assessments to COs]
    I --> J[Input Assessment Data]
    I --> J[Calculate CO Attainment]
    J --> K[Map COs to POs]
    K --> L[Calculate PO Attainment]

    E --> M[Manage Users]
    E --> N[Configure CO-PO Mapping]
    E --> O[Set Attainment Thresholds]
    E --> P[Generate Reports]

    F --> Q[View CO Attainment]
    F --> R[View PO Attainment]

    L --> S[Generate CO-PO Matrix]
    S --> T[NBA Compliance Check]
    T --> U{Meets NBA Standards?}

    U -->|Yes| V[Generate Success Report]
    U -->|No| W[Identify Gaps]
    W --> X[Suggest Improvements]

    P --> Y[Institution Level Reports]
    P --> Z[Program Level Reports]
    P --> AA[Course Level Reports]

    V --> BB[Export NBA Documentation]
    X --> BB
    Y --> BB
    Z --> BB
    AA --> BB

    BB --> CC[Archive Results]
    CC --> DD[End]

    Q --> DD
    R --> DD
    M --> DD
    N --> DD
    O --> DD

    style A fill:#e1f5fe
    style DD fill:#f3e5f5
    style T fill:#fff3e0
    style U fill:#fff3e0
    style S fill:#e8f5e8
