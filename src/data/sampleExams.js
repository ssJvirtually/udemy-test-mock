// Built-in sample mock exams ready to practice right away

export const SAMPLE_EXAMS = [
  {
    id: "builtin-aws-saa",
    title: "AWS Certified Solutions Architect (SAA-C03) High-Yield Mock",
    description: "Scenario-based practice questions reflecting the real SAA-C03 exam format, including multi-tier architectures, resilient VPC networking, S3 lifecycle, and security best practices.",
    category: "Cloud Architecture",
    durationMinutes: 20,
    passingScore: 72,
    domains: [
      "Domain 1: Design Secure Architectures",
      "Domain 2: Design Resilient Architectures",
      "Domain 3: Design High-Performing Architectures",
      "Domain 4: Design Cost-Optimized Architectures"
    ],
    questions: [
      {
        id: 1,
        domain: "Domain 2: Design Resilient Architectures",
        difficulty: "Intermediate",
        type: "single",
        question: "An e-commerce company hosts a three-tier web application on Amazon EC2 instances in an Auto Scaling group behind an Application Load Balancer (ALB). The database tier runs on an Amazon RDS for MySQL Multi-AZ DB cluster. During a major flash sale, database read queries cause CPU utilization on the primary database instance to reach 98%, slowing down page loads. The write traffic remains low and steady. What architectural change should the solutions architect implement with the LEAST operational overhead?",
        codeSnippet: "",
        options: [
          "Create Amazon RDS Read Replicas and modify the web application to route read traffic to the read replica endpoints.",
          "Migrate the RDS database to an Amazon Redshift cluster to distribute the read query workload.",
          "Vertically scale the primary RDS DB instance to a memory-optimized instance class during peak hours.",
          "Place an Amazon ElastiCache Redis cluster between the ALB and EC2 instances."
        ],
        correctAnswer: 0,
        explanation: "Amazon RDS Read Replicas offload read-heavy database workloads from the primary DB instance, allowing read scaling with minimal operational overhead. Read traffic can easily be directed to read replica endpoints while writes continue to the primary. Redshift is for OLAP analytical queries, not transactional e-commerce reads. Vertical scaling causes downtime or failover and requires manual intervention. ElastiCache is placed between the web/app tier and the database tier, not between the ALB and EC2.",
        optionRationales: {
          "A": "Correct: Read replicas directly offload read operations from the primary DB instance with minimal operational friction.",
          "B": "Incorrect: Amazon Redshift is a data warehouse solution for complex analytics, not a drop-in replacement for OLTP databases.",
          "C": "Incorrect: Scaling vertically requires maintenance windows or instance restarts and doesn't scale horizontally for future surges.",
          "D": "Incorrect: ElastiCache sits between the application tier and the database tier (caching query results), not between ALB and EC2."
        },
        referenceUrl: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"
      },
      {
        id: 2,
        domain: "Domain 1: Design Secure Architectures",
        difficulty: "Advanced",
        type: "multiple",
        question: "A healthcare startup must store sensitive patient medical images in an Amazon S3 bucket. Compliance standards mandate that: (1) All objects must be encrypted at rest using keys where key rotation is tracked and access can be audited by external regulators, and (2) No unencrypted plaintext communication (HTTP) may ever reach the bucket under any circumstance. Which TWO solutions should the architect combine? (Select TWO)",
        codeSnippet: "",
        options: [
          "Use Server-Side Encryption with AWS KMS keys (SSE-KMS) with automatic annual key rotation enabled.",
          "Attach an S3 bucket policy denying all s3:GetObject and s3:PutObject requests where 'aws:SecureTransport' equals 'false'.",
          "Enable default Server-Side Encryption with Amazon S3 managed keys (SSE-S3).",
          "Deploy AWS WAF in front of Amazon S3 to inspect packet headers for SSL certificates.",
          "Configure an S3 Object Lock in compliance mode for all uploaded medical records."
        ],
        correctAnswer: [0, 1],
        explanation: "SSE-KMS provides audited key usage in AWS CloudTrail and allows automatic annual key rotation, satisfying compliance auditing requirements. To enforce encrypted transit (HTTPS only), an S3 bucket policy containing a condition where 'aws:SecureTransport' is false must deny access, rejecting any plaintext HTTP requests.",
        optionRationales: {
          "A": "Correct: SSE-KMS provides detailed CloudTrail audit logs of every key usage and supports automated key rotation.",
          "B": "Correct: The aws:SecureTransport condition in an S3 bucket policy is the canonical AWS pattern to enforce HTTPS.",
          "C": "Incorrect: SSE-S3 uses 256-bit AES keys managed entirely by S3 without customer-auditable KMS key policies or rotation tracking.",
          "D": "Incorrect: AWS WAF cannot be directly attached to an Amazon S3 bucket; it attaches to CloudFront, ALB, or API Gateway.",
          "E": "Incorrect: S3 Object Lock prevents object deletion or overwrite (WORM), but does not encrypt or enforce HTTPS transit."
        },
        referenceUrl: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html"
      },
      {
        id: 3,
        domain: "Domain 4: Design Cost-Optimized Architectures",
        difficulty: "Intermediate",
        type: "single",
        question: "A media publishing company generates 10 TB of video files each month. The video files are frequently accessed during the first 30 days after publication. After 30 days, access drops significantly to once or twice every 6 months. After 1 year, regulations require videos to be preserved for 7 years, but access is rare and retrieval can take 3 to 5 hours. Which Amazon S3 Lifecycle configuration is the MOST cost-effective?",
        codeSnippet: "",
        options: [
          "Transition objects from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) after 30 days, then to S3 Glacier Flexible Retrieval after 365 days.",
          "Keep objects in S3 Standard for 365 days, then transition directly to S3 Glacier Deep Archive.",
          "Transition objects from S3 Standard to S3 One Zone-IA after 30 days, then expire objects after 365 days.",
          "Transition objects to S3 Glacier Instant Retrieval immediately upon creation."
        ],
        correctAnswer: 0,
        explanation: "S3 Standard-IA is ideal for data accessed less frequently but requiring immediate access when requested (retrieval within milliseconds) between 30 and 365 days. After 1 year, S3 Glacier Flexible Retrieval provides extremely low storage costs with standard retrieval times of 3-5 hours, perfectly meeting the 7-year regulatory requirement.",
        optionRationales: {
          "A": "Correct: S3 Standard-IA matches the 30-365 day access profile, and Glacier Flexible Retrieval is ideal for rare 3-5h retrieval needs.",
          "B": "Incorrect: Keeping files in expensive S3 Standard for an entire year when access is rare wastes substantial money.",
          "C": "Incorrect: One Zone-IA does not provide multi-AZ resilience for precious media, and expiring files after 365 days violates the 7-year retention mandate.",
          "D": "Incorrect: Glacier Instant Retrieval charges high per-GB retrieval fees during the first 30 days of high frequency access."
        },
        referenceUrl: "https://aws.amazon.com/s3/storage-classes/"
      },
      {
        id: 4,
        domain: "Domain 3: Design High-Performing Architectures",
        difficulty: "Advanced",
        type: "single",
        question: "A gaming company needs to deploy a microservice that processes telemetry packets from hundreds of thousands of connected mobile devices worldwide. The packets must be ingested in real-time with sub-millisecond response latency and routed dynamically to EC2 instances across multiple AWS Regions. The solution requires anycast IP addresses so that mobile clients can route to the nearest AWS edge point. What AWS service should be utilized?",
        codeSnippet: "",
        options: [
          "AWS Global Accelerator",
          "Amazon Route 53 with Geolocation routing policy",
          "Amazon CloudFront with Origin Shield",
          "AWS Direct Connect with Transit Gateway"
        ],
        correctAnswer: 0,
        explanation: "AWS Global Accelerator provides static anycast IP addresses that act as a fixed entry point to your application endpoints in single or multiple AWS Regions. It routes traffic over the AWS global network backbone, improving UDP and TCP performance and reducing latency by up to 60%. Route 53 Geolocation relies on DNS caching which does not provide immediate failover or anycast IPs. CloudFront is primarily for HTTP/HTTPS web caching.",
        optionRationales: {
          "A": "Correct: Global Accelerator provides static Anycast IP addresses and routes TCP/UDP traffic over the AWS global private fiber network.",
          "B": "Incorrect: Route 53 Geolocation is subject to client-side DNS caching and TTL delays, not anycast IP routing.",
          "C": "Incorrect: CloudFront is an HTTP/HTTPS CDN and does not support arbitrary low-latency raw UDP/TCP gaming telemetry.",
          "D": "Incorrect: Direct Connect is a dedicated physical circuit from on-premises data centers to AWS, not for global mobile clients."
        },
        referenceUrl: "https://aws.amazon.com/global-accelerator/"
      },
      {
        id: 5,
        domain: "Domain 2: Design Resilient Architectures",
        difficulty: "Intermediate",
        type: "single",
        question: "A company operates an order processing pipeline where orders submitted on the website are written to a queue before being processed by backend worker instances. During peak promotional periods, orders arrive faster than workers can process them. The company wants to decouple the components and ensure that sudden traffic surges do not drop any orders, while workers scale up dynamically based on queue depth. Which combination of services should be used?",
        codeSnippet: "",
        options: [
          "Amazon SQS standard queue with an Auto Scaling group scaling based on the 'ApproximateNumberOfMessagesVisible' metric.",
          "Amazon SNS topic with EC2 Auto Scaling based on ALB request count per target.",
          "Amazon Kinesis Data Firehose writing directly to Amazon S3.",
          "Amazon EventBridge with an AWS Lambda function triggered on a 1-minute schedule."
        ],
        correctAnswer: 0,
        explanation: "Amazon SQS acts as a resilient buffer that decouples the web front-end from the worker instances. Using Amazon CloudWatch metric 'ApproximateNumberOfMessagesVisible' (or backlog per instance) allows the worker Auto Scaling group to scale out when queue depth grows, ensuring no orders are lost.",
        optionRationales: {
          "A": "Correct: SQS provides reliable buffering, and scaling on queue depth (backlog per worker) ensures elastic processing without drops.",
          "B": "Incorrect: SNS is push-based pub/sub without built-in worker queuing or message persistence for slow consumers.",
          "C": "Incorrect: Kinesis Data Firehose is for streaming ETL into destinations like S3/Redshift, not an interactive order processing queue.",
          "D": "Incorrect: Polling EventBridge on a schedule is inefficient and will introduce latency and scale bottleneck."
        },
        referenceUrl: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"
      }
    ]
  },
  {
    id: "builtin-gcp-pca",
    title: "Google Cloud Professional Cloud Architect (GCP PCA) Mock Exam",
    description: "Authentic scenario-based questions modeled after the Google Cloud Professional Cloud Architect certification, covering Cloud Spanner, Workload Identity, Dedicated Interconnect, Cloud Armor, and BigQuery analytics.",
    category: "Cloud Architecture",
    durationMinutes: 25,
    passingScore: 75,
    domains: [
      "Section 1: Designing and planning a cloud solution architecture",
      "Section 2: Managing and provisioning a solution infrastructure",
      "Section 3: Designing for security and compliance",
      "Section 4: Analyzing and optimizing technical and business processes",
      "Section 6: Ensuring solution and operations reliability"
    ],
    questions: [
      {
        id: 1,
        domain: "Section 1: Designing and planning a cloud solution architecture",
        difficulty: "Advanced scenario-based",
        type: "single",
        question: "A global financial institution is architecting a transaction processing backend on Google Cloud. The system must support synchronized global ACID transactions across North America, Europe, and Asia with sub-10ms read latencies, automatic sharding, and guaranteed 99.999% (five nines) availability SLA. Which Google Cloud storage service should the architect select?",
        codeSnippet: "",
        options: [
          "Cloud Spanner configured with a multi-region instance configuration.",
          "Cloud Bigtable with multi-cluster replication across regions.",
          "Cloud SQL for PostgreSQL with cross-region read replicas.",
          "Firestore in Datastore mode with global replication."
        ],
        correctAnswer: 0,
        explanation: "Cloud Spanner is Google Cloud's fully managed, mission-critical relational database service designed specifically for global scale with strong ACID consistency, automatic horizontal sharding, and up to 99.999% availability SLA in multi-region instances using TrueTime atomic clocks. Cloud Bigtable is NoSQL and does not provide multi-row ACID transactions. Cloud SQL cross-region replicas are asynchronously replicated and cannot guarantee global synchronous ACID consistency.",
        optionRationales: {
          "A": "Correct: Multi-region Cloud Spanner is built for global synchronous ACID transactions and provides a 99.999% availability SLA.",
          "B": "Incorrect: Cloud Bigtable is a wide-column NoSQL store built for massive analytical throughput, not transactional ACID schemas.",
          "C": "Incorrect: Cloud SQL uses asynchronous replication for cross-region replicas and does not support 99.999% SLA or automatic global sharding.",
          "D": "Incorrect: Firestore is a document store and does not meet the high-throughput complex SQL relational requirements for global banking ledgers."
        },
        referenceUrl: "https://cloud.google.com/spanner/docs/instance-configurations#multi-region-configurations"
      },
      {
        id: 2,
        domain: "Section 3: Designing for security and compliance",
        difficulty: "Intermediate",
        type: "single",
        question: "Your organization runs containerized microservices on Google Kubernetes Engine (GKE). Several pods need read and write access to Cloud Storage buckets and Secret Manager secrets. Company security policy strictly forbids generating, downloading, or storing service account private key JSON files inside containers or Kubernetes Secrets. What is the recommended Google Cloud approach?",
        codeSnippet: "",
        options: [
          "Enable GKE Workload Identity and bind Kubernetes Service Accounts (KSAs) to Google Service Accounts (GSAs).",
          "Attach the default Compute Engine service account with Project Owner permissions to all GKE node pools.",
          "Store the service account key inside a HashiCorp Vault cluster running on GKE and inject it at runtime.",
          "Assign the required IAM roles directly to each developer's personal Google Account."
        ],
        correctAnswer: 0,
        explanation: "Workload Identity is the recommended best practice for authenticating workloads on GKE. It allows a Kubernetes service account (KSA) in a GKE cluster to act as an IAM Google service account (GSA), automatically exchanging short-lived credentials via the GKE metadata server without needing any long-lived service account key files.",
        optionRationales: {
          "A": "Correct: Workload Identity eliminates the need for service account keys by mapping Kubernetes Service Accounts directly to Google IAM Service Accounts.",
          "B": "Incorrect: Using default service accounts with Owner permissions violates the principle of least privilege and causes massive security vulnerability.",
          "C": "Incorrect: Still involves managing long-lived static private keys, whereas Workload Identity is keyless and natively integrated.",
          "D": "Incorrect: Workloads run as service accounts, not user accounts, and personal accounts cannot be mounted onto GKE pods."
        },
        referenceUrl: "https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity"
      },
      {
        id: 3,
        domain: "Section 6: Ensuring solution and operations reliability",
        difficulty: "Advanced scenario-based",
        type: "multiple",
        question: "An enterprise is establishing hybrid connectivity between its primary on-premises data centers and Google Cloud Virtual Private Cloud (VPC). The enterprise architecture board requires a 99.99% availability SLA for mission-critical production workloads. Which TWO network configurations must be implemented to qualify for Google Cloud's 99.99% Dedicated Interconnect SLA? (Select TWO)",
        codeSnippet: "",
        options: [
          "Provision two Cloud Interconnect circuits in two separate metropolitan areas (different colocation facilities).",
          "Deploy two Cloud Routers in each region and establish dual eBGP sessions per interconnect connection.",
          "Deploy a single 100 Gbps Cloud Interconnect with a Carrier Peering fallback link.",
          "Use Cloud VPN over the public Internet configured with static routes as the primary transport.",
          "Enable VPC Network Peering between the on-premises border router and the Google Cloud VPC."
        ],
        correctAnswer: [0, 1],
        explanation: "Google Cloud requires dual Dedicated Interconnect circuits deployed in two separate metropolitan areas (or two distinct colocation facilities/domains) with two Cloud Routers per region and dynamic eBGP routing to qualify for the 99.99% availability SLA. Single facility connections only qualify for 99.9% availability.",
        optionRationales: {
          "A": "Correct: 99.99% SLA mandates redundant interconnects in two different metropolitan areas/colocation facilities.",
          "B": "Correct: Dual Cloud Routers with eBGP peering across redundant circuits in each region ensure complete equipment failure tolerance.",
          "C": "Incorrect: Carrier Peering is not a replacement for Dedicated Interconnect and does not offer SLA-backed private routing.",
          "D": "Incorrect: Cloud VPN over the public internet has variable latency and cannot guarantee 99.99% enterprise interconnect throughput.",
          "E": "Incorrect: VPC Network Peering connects two Google Cloud VPC networks, not on-premises enterprise data center routers."
        },
        referenceUrl: "https://cloud.google.com/network-connectivity/docs/interconnect/tutorials/dedicated-creating-9999-availability"
      },
      {
        id: 4,
        domain: "Section 3: Designing for security and compliance",
        difficulty: "Advanced",
        type: "single",
        question: "An online retail platform experiences periodic Layer 7 HTTP flood attacks and credential stuffing attempts from specific geographic IP ranges. The application is served by a Global External Application Load Balancer with Compute Engine backends. You must mitigate these attacks at the Google Cloud edge network before traffic hits backend instances, without introducing application code changes. What should you configure?",
        codeSnippet: "",
        options: [
          "Configure Google Cloud Armor security policies with rate limiting, geo-fencing (geo-blocking), and preconfigured WAF rules attached to the backend service.",
          "Configure Cloud IDS (Intrusion Detection System) to automatically drop malicious TCP SYN packets.",
          "Write an iptables firewall script on each Compute Engine VM instance to block abusive IP addresses.",
          "Create VPC Firewall rules with priority 1000 to filter incoming HTTP headers."
        ],
        correctAnswer: 0,
        explanation: "Google Cloud Armor integrates directly with Global External Application Load Balancers to inspect and filter web traffic at Google's global edge infrastructure. It offers Layer 7 DDoS mitigation, rate limiting, IP allow/deny lists, geographic filtering, and preconfigured WAF rules (OWASP Top 10) before traffic ever reaches your backend instances.",
        optionRationales: {
          "A": "Correct: Cloud Armor inspects traffic at the Google edge, applying rate limits, geo-blocking, and WAF rules to protect backend services.",
          "B": "Incorrect: Cloud IDS detects intrusions and alerts via Cloud Logging, but it is an inspection service and does not inline drop Layer 7 traffic.",
          "C": "Incorrect: Host-level iptables still allows traffic to reach and saturate VM network interfaces, failing to stop edge volumetric attacks.",
          "D": "Incorrect: VPC firewall rules operate at Layer 3/4 (IP and port) and cannot inspect Layer 7 HTTP headers, URLs, or geo-locations."
        },
        referenceUrl: "https://cloud.google.com/armor/docs/cloud-armor-overview"
      },
      {
        id: 5,
        domain: "Section 1: Designing and planning a cloud solution architecture",
        difficulty: "Intermediate",
        type: "single",
        question: "A company receives telemetry streams from 500,000 IoT sensors every second. The data must be ingested with high durability, processed in real-time to compute 5-minute tumbling window averages, and stored in a serverless data warehouse for analytical SQL queries by data scientists. The solution should be completely serverless with zero infrastructure maintenance. Which architecture should the cloud architect propose?",
        codeSnippet: "",
        options: [
          "Ingest into Cloud Pub/Sub -> Process streams using Cloud Dataflow (Apache Beam) -> Store results in Google BigQuery.",
          "Ingest into Cloud Logging -> Process using Cloud Functions -> Write to Cloud Bigtable.",
          "Ingest into Compute Engine VMs running Apache Kafka -> Process with Apache Spark on Dataproc -> Store in Cloud Storage.",
          "Ingest into Cloud Storage via Transfer Appliance -> Batch load into Cloud SQL for MySQL."
        ],
        correctAnswer: 0,
        explanation: "The canonical Google Cloud streaming architecture is: Cloud Pub/Sub for scalable, serverless, durable event ingestion -> Cloud Dataflow for fully managed, autoscaling stream processing with native windowing and exactly-once processing -> BigQuery for petabyte-scale serverless SQL analytics. Dataproc and Kafka require VM management, while Transfer Appliance is for offline bulk migrations.",
        optionRationales: {
          "A": "Correct: Pub/Sub + Dataflow + BigQuery is the standard serverless streaming analytics reference architecture on GCP.",
          "B": "Incorrect: Cloud Logging is not an event streaming bus, and Bigtable does not provide native SQL analytics for data scientists.",
          "C": "Incorrect: Kafka and Dataproc involve managing compute clusters and operational maintenance, violating the zero-maintenance requirement.",
          "D": "Incorrect: Transfer Appliance is a physical hardware appliance for multi-terabyte offline transfers, not real-time per-second IoT streams."
        },
        referenceUrl: "https://cloud.google.com/architecture/streaming-data-processing-reference-architecture"
      }
    ]
  },
  {
    id: "builtin-react-frontend",
    title: "React 19 & Modern Frontend Architecture Mastery",
    description: "Deep dive test on React internals, useEffect hook dependencies, race condition handling, rendering optimization, useMemo vs useCallback, and state machines.",
    category: "Software Engineering",
    durationMinutes: 20,
    passingScore: 75,
    domains: [
      "React Core & Lifecycle",
      "Hooks & State Management",
      "Performance & Rendering",
      "Asynchronous Data & Clean Architecture"
    ],
    questions: [
      {
        id: 1,
        domain: "Hooks & State Management",
        difficulty: "Intermediate",
        type: "single",
        question: "Review the following React component. When the button is clicked multiple times rapidly, what bug or unexpected behavior will occur, and why?",
        codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}`,
        options: [
          "Stale closure bug: Rapid clicks will overwrite previous updates and count will only increase by 1, because count is captured in the callback scope.",
          "A runtime TypeError will occur because useState setter functions cannot be invoked inside setTimeout.",
          "An infinite re-render loop will freeze the browser tab.",
          "The component will batch all clicks and immediately render the final count without delay."
        ],
        correctAnswer: 0,
        explanation: "Because `handleClick` captures the value of `count` from the closure of the render in which it was created, rapid clicks in the same 1-second window will all run `setCount(0 + 1)`. To fix this, use the functional state updater form: `setCount(prev => prev + 1)` which guarantees access to the latest state value.",
        optionRationales: {
          "A": "Correct: The callback forms a closure over the snapshot of 'count' at click time. Functional updates `prev => prev + 1` are required.",
          "B": "Incorrect: Setters can be called asynchronously in event handlers, timeouts, and promises without any TypeError.",
          "C": "Incorrect: No infinite re-render occurs because the update happens only on click timeout completion.",
          "D": "Incorrect: The timeouts fire after 1000ms and are not batched into a single immediate synchronous render."
        },
        referenceUrl: "https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state"
      },
      {
        id: 2,
        domain: "Asynchronous Data & Clean Architecture",
        difficulty: "Advanced",
        type: "single",
        question: "An engineer implements search autocomplete in a React component using an async effect. What is the standard idiomatic React pattern to prevent race conditions when the user types rapidly (e.g. typing 'ca' then 'cat')?",
        codeSnippet: `useEffect(() => {
  let isCurrent = true;
  fetchResults(query).then(data => {
    if (isCurrent) setResults(data);
  });
  return () => { isCurrent = false; };
}, [query]);`,
        options: [
          "Use a cleanup flag or AbortController to discard the responses of stale requests when the query changes before the previous network call finishes.",
          "Wrap the fetchResults function in useMemo with no dependencies.",
          "Set the query state synchronously inside a useLayoutEffect hook.",
          "Increase the network timeout on the fetch call to 10 seconds."
        ],
        correctAnswer: 0,
        explanation: "Network responses may arrive out of order (e.g., response for 'ca' could return after response for 'cat'). Using an active flag in the effect cleanup or using an AbortController to cancel previous fetch requests ensures only the response from the latest active effect invocation updates the state.",
        optionRationales: {
          "A": "Correct: Cleanup flags or AbortController ignore/abort outdated async responses, avoiding stale state overrides.",
          "B": "Incorrect: useMemo caches computed values during render, it does not prevent network request race conditions.",
          "C": "Incorrect: useLayoutEffect runs before paint but does not alter asynchronous network latency or response arrival order.",
          "D": "Incorrect: Increasing network timeout worsens race conditions instead of resolving them."
        },
        referenceUrl: "https://react.dev/learn/synchronizing-with-effects#fetching-data"
      },
      {
        id: 3,
        domain: "Performance & Rendering",
        difficulty: "Intermediate",
        type: "multiple",
        question: "Which of the following actions trigger a re-render of a React functional component? (Select TWO)",
        codeSnippet: "",
        options: [
          "Calling a useState setter function with a new primitive or a newly referenced object.",
          "A parent component re-rendering, unless the child is memoized with React.memo and its props haven't changed.",
          "Mutating a mutable value stored inside a useRef object (e.g., countRef.current += 1).",
          "Modifying a global JavaScript variable outside the component body.",
          "Dispatching an action to a Redux store that no component selector subscribes to."
        ],
        correctAnswer: [0, 1],
        explanation: "In React, a component re-renders when: (1) Its internal state changes via useState or useReducer, and (2) Its parent component re-renders (unless wrapped in React.memo with shallowly equal props). Mutating useRef.current does NOT trigger a re-render by design.",
        optionRationales: {
          "A": "Correct: Invoking state setters with changed values triggers a render scheduled by the React reconciliation engine.",
          "B": "Correct: Parent re-renders propagate down the component subtree unless memoized.",
          "C": "Incorrect: Mutating useRef.current does not notify React and does not schedule a render.",
          "D": "Incorrect: Global variable mutations do not trigger React renders without an explicit subscription/state sync.",
          "E": "Incorrect: Unsubscribed Redux store actions do not notify components that have not subscribed via selectors."
        },
        referenceUrl: "https://react.dev/learn/render-and-commit"
      }
    ]
  },
  {
    id: "builtin-python-system",
    title: "Python 3 & Backend Systems Engineering",
    description: "Scenario-based exam covering Python memory management, GIL, async/await event loops, generator pipelines, and high-concurrency database connection pooling.",
    category: "Software Engineering",
    durationMinutes: 20,
    passingScore: 70,
    domains: [
      "Python Internals & Memory",
      "AsyncIO & Concurrency",
      "System Design & APIs",
      "Clean Code & Architecture"
    ],
    questions: [
      {
        id: 1,
        domain: "AsyncIO & Concurrency",
        difficulty: "Intermediate",
        type: "single",
        question: "Consider an I/O-heavy web crawler written with Python's standard `asyncio` library. One function contains a CPU-intensive cryptographic calculation that takes 4 seconds of pure computation. What happens if this CPU-heavy function is called synchronously inside an `async def` route handler?",
        codeSnippet: `async def handle_request():
    result = heavy_cryptographic_hash(large_data) # takes 4 seconds
    return {"status": "ok", "hash": result}`,
        options: [
          "It blocks the single-threaded asyncio event loop entirely for 4 seconds, causing all concurrent HTTP requests to stall.",
          "Asyncio automatically preempts the calculation and splits it across available CPU cores.",
          "The GIL automatically yields execution to other coroutines every 5 milliseconds.",
          "The Python interpreter throws a ConcurrencyViolationException."
        ],
        correctAnswer: 0,
        explanation: "Python's asyncio runs on a single event loop thread with cooperative multitasking. If a coroutine executes long synchronous blocking code or CPU-bound math, it never yields control (no 'await'), starving all other tasks on that event loop. To run CPU-bound work without blocking the loop, use `asyncio.to_thread` or a `ProcessPoolExecutor`.",
        optionRationales: {
          "A": "Correct: Cooperative multitasking requires yielding back to the event loop. CPU-bound synchronous code freezes the entire loop.",
          "B": "Incorrect: Asyncio is single-threaded cooperative multitasking and does not automatically distribute code across cores.",
          "C": "Incorrect: The GIL switch interval only applies between OS threads, not between coroutines on a single event loop thread.",
          "D": "Incorrect: No exception is raised; it simply silently blocks until execution finishes."
        },
        referenceUrl: "https://docs.python.org/3/library/asyncio-task.html#running-in-threads"
      },
      {
        id: 2,
        domain: "Python Internals & Memory",
        difficulty: "Advanced",
        type: "single",
        question: "What is the primary reason why defining default arguments as mutable objects (e.g. `def append_to(item, target_list=[])`) in Python causes unexpected behavior across function calls?",
        codeSnippet: `def add_item(item, basket=[]):
    basket.append(item)
    return basket

print(add_item("apple"))  # ['apple']
print(add_item("banana")) # What does this print?`,
        options: [
          "Default argument values are evaluated only ONCE when the function definition is executed, meaning the same mutable list instance is reused across all calls.",
          "Python automatically shares memory between variables named 'basket'.",
          "The Garbage Collector fails to deallocate local scopes inside functions with default arguments.",
          "Lists in Python are immutable by default when passed as parameters."
        ],
        correctAnswer: 0,
        explanation: "Default parameter expressions in Python are evaluated once at module definition time, not every time the function is called. The default list object is stored on the function's `__defaults__` attribute, so any mutations persist across calls. The idiomatic pattern is `def add_item(item, basket=None): if basket is None: basket = []`.",
        optionRationales: {
          "A": "Correct: Python evaluates default arguments at function definition time, binding a single shared object.",
          "B": "Incorrect: Variable names do not cause cross-call memory sharing.",
          "C": "Incorrect: The object is referenced by `add_item.__defaults__`, which is why it remains allocated.",
          "D": "Incorrect: Python lists are mutable."
        },
        referenceUrl: "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values"
      }
    ]
  }
];
