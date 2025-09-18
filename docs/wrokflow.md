flowchart TD
A[Start] --> B[User Login/Authentication]
B --> C{User Role?}

    C -->|Faculty| F[Faculty Dashboard]
    C -->|HOD| H[HOD Dashboard]
    C -->|Office Staff| E[Staff Dashboard]
    C -->|Dean| D[Dean Dashboard]
    C -->|Admin| G[Admin Dashboard]

    F --> I[Select Course]
    I --> J[Select Test]
    J --> K[Map Assessments to COs]
    K --> L[Input Assessment Data]
    L --> M[Calculate CO Attainment]

    M --> N[Map & Send For COs to POs Mapping]
    N --> O{Atleast three different faculty maps?}
    O --> |Yes| P[Calculate PO Attainment]
    O --> |No| Q[Approval From HOD]
    Q --> |Yes| P[Calculate PO Attainment]
    P --> R[Generate CO-PO Matrix]
    R --> S[Export NBA Documentation]
    S --> T[Archive Results]
    T --> U[End]

    style A fill:#e1f5fe
    style U fill:#f3e5f5
    style S fill:#e8f5e8
