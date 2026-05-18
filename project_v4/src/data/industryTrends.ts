export type TrendDomain = "Semiconductors" | "Robotics" | "Automation";

export type TrendSignalType =
  | "Chip Release"
  | "Supply Chain"
  | "Company Move"
  | "Emerging Tech"
  | "Standards";

export type TrendMomentum = "Accelerating" | "Emerging" | "Watching";

export interface IndustryTrendSignal {
  id: string;
  title: string;
  summary: string;
  domain: TrendDomain;
  signalType: TrendSignalType;
  momentum: TrendMomentum;
  horizon: "Now" | "Next 12 months" | "1-3 years" | "2-5 years";
  impact: string;
  tags: string[];
  sourceName: string;
  sourceUrl?: string;
  publishedAt?: string;
}

export interface TrendForecast {
  id: string;
  title: string;
  direction: "Gaining traction" | "Stable demand" | "Losing momentum";
  domain: TrendDomain | "Cross-industry";
  timeframe: "0-12 months" | "1-3 years" | "2-5 years";
  confidence: number;
  summary: string;
  whyItMatters: string;
  signals: string[];
  skills: string[];
  watchouts: string[];
}

export interface SkillForecast {
  skill: string;
  demand: "Critical" | "High" | "Rising";
  timeframe: "Now" | "1-3 years" | "2-5 years";
  domains: TrendDomain[];
  reason: string;
}

export interface DecliningTechnology {
  name: string;
  pressure: "High" | "Medium";
  replacement: string;
  note: string;
}

export const TREND_SOURCE_QUERIES: {
  domain: TrendDomain;
  query: string;
  keywords: string[];
}[] = [
  {
    domain: "Semiconductors",
    query:
      "semiconductor chip release OR RISC-V OR AI accelerator OR chiplet OR HBM OR UCIe",
    keywords: ["semiconductor", "chip", "RISC-V", "AI accelerator", "chiplet", "HBM", "UCIe"],
  },
  {
    domain: "Robotics",
    query:
      "robotics automation ROS 2 humanoid robot mobile robot sensor fusion edge AI",
    keywords: ["robotics", "ROS 2", "humanoid", "mobile robot", "sensor fusion", "edge AI"],
  },
  {
    domain: "Automation",
    query:
      "industrial automation PLC OPC UA TSN robot factory supply chain semiconductor",
    keywords: ["industrial automation", "PLC", "OPC UA", "TSN", "factory", "supply chain"],
  },
];

const BASE_CURATED_TREND_SIGNALS: IndustryTrendSignal[] = [
  {
    id: "riscv-custom-edge",
    title: "RISC-V moves from evaluation boards into custom edge controllers",
    summary:
      "Open ISA designs are becoming more practical for teams that need custom instructions, tighter cost control, or domain-specific acceleration at the edge.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Accelerating",
    horizon: "2-5 years",
    impact:
      "Embedded engineers will need stronger comfort with toolchains, board support packages, and architecture-specific debugging beyond ARM-only workflows.",
    tags: ["RISC-V", "custom silicon", "embedded Linux", "toolchains"],
    sourceName: "Curated baseline",
  },
  {
    id: "sensor-near-ai",
    title: "AI accelerators move closer to sensors and control loops",
    summary:
      "Inference is shifting from cloud-only pipelines toward MCUs, NPUs, smart cameras, and industrial gateways where latency, privacy, and bandwidth matter.",
    domain: "Semiconductors",
    signalType: "Chip Release",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Projects increasingly need quantization, memory planning, accelerator SDKs, and real-time integration skills.",
    tags: ["edge AI", "NPU", "TinyML", "sensor fusion"],
    sourceName: "Curated baseline",
  },
  {
    id: "chiplet-packaging",
    title: "Chiplets and advanced packaging change system architecture decisions",
    summary:
      "Heterogeneous packages let companies combine compute, I/O, memory, RF, and accelerators without putting every block on one monolithic die.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "2-5 years",
    impact:
      "Architecture discussions are moving toward interconnects, memory bandwidth, thermal limits, and hardware/software partitioning.",
    tags: ["chiplets", "UCIe", "advanced packaging", "HBM"],
    sourceName: "Curated baseline",
  },
  {
    id: "mcu-dual-source",
    title: "Supply chain designs favor second-source MCUs and software portability",
    summary:
      "Teams are treating availability risk as an architecture constraint, not just a procurement issue, especially for long-life industrial products.",
    domain: "Semiconductors",
    signalType: "Supply Chain",
    momentum: "Watching",
    horizon: "Next 12 months",
    impact:
      "HAL boundaries, portable drivers, RTOS abstraction, and BOM-aware design reviews become more valuable.",
    tags: ["supply chain", "MCU", "BOM risk", "portability"],
    sourceName: "Curated baseline",
  },
  {
    id: "ros2-safety",
    title: "Robotics stacks converge around ROS 2 plus safety-rated control layers",
    summary:
      "ROS 2 is becoming the common integration layer, while commercial deployments still require deterministic control, safety PLCs, and certified stops.",
    domain: "Robotics",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Robotics roles increasingly ask for middleware knowledge alongside controls, real-time Linux, and safety systems.",
    tags: ["ROS 2", "real-time Linux", "functional safety", "motion control"],
    sourceName: "Curated baseline",
  },
  {
    id: "robotics-embodied-ai",
    title: "Embodied AI raises demand for perception, controls, and hardware co-design",
    summary:
      "Humanoid, mobile manipulation, and warehouse automation pilots are pushing teams to connect foundation-model planning with dependable embedded control.",
    domain: "Robotics",
    signalType: "Company Move",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "The strongest candidates can bridge ML inference, sensors, motor control, and failure-mode thinking.",
    tags: ["humanoids", "mobile robots", "perception", "controls"],
    sourceName: "Curated baseline",
  },
  {
    id: "opcua-tsn",
    title: "Automation networks standardize around secure, interoperable data models",
    summary:
      "OPC UA, TSN, MQTT, and modern industrial Ethernet are reducing vendor islands and making plant data easier to move into analytics systems.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Next 12 months",
    impact:
      "Industrial engineers need stronger networking, cybersecurity, and time-sensitive systems fundamentals.",
    tags: ["OPC UA", "TSN", "MQTT", "industrial Ethernet"],
    sourceName: "Curated baseline",
  },
  {
    id: "ot-security-gate",
    title: "Cybersecurity becomes a buying requirement for connected automation",
    summary:
      "Connected machines, remote service, and digital twins are making secure boot, signed updates, identity, and segmentation core product features.",
    domain: "Automation",
    signalType: "Supply Chain",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "IEC 62443 literacy, threat modeling, secure firmware update flows, and incident-ready telemetry matter more in interviews and design reviews.",
    tags: ["IEC 62443", "secure boot", "OTA", "OT security"],
    sourceName: "Curated baseline",
  },
];

type TrendExpansionSeed = Omit<IndustryTrendSignal, "id" | "sourceName"> & {
  id: string;
};

const TREND_EXPANSION_SEEDS: TrendExpansionSeed[] = [
  {
    id: "ai-mcu-segmentation",
    title: "AI MCU portfolios split into tiny, midrange, and vision-class NPUs",
    summary:
      "MCU vendors are separating general-purpose controllers from parts with on-chip neural accelerators, dedicated SRAM, and camera-friendly peripherals.",
    domain: "Semiconductors",
    signalType: "Chip Release",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Selection criteria now include model size, tensor arena memory, compiler support, and how inference fits beside real-time firmware.",
    tags: ["AI MCU", "NPU", "TinyML", "SRAM"],
  },
  {
    id: "hbm-memory-wall",
    title: "HBM availability and bandwidth shape AI accelerator roadmaps",
    summary:
      "High-bandwidth memory is becoming one of the limiting resources for data center and workstation AI hardware.",
    domain: "Semiconductors",
    signalType: "Supply Chain",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Engineers who understand bandwidth, locality, and thermal limits can explain accelerator tradeoffs more clearly.",
    tags: ["HBM", "memory bandwidth", "AI accelerator", "thermal"],
  },
  {
    id: "ucie-chiplet-ecosystem",
    title: "UCIe turns chiplet integration into an ecosystem decision",
    summary:
      "Open chiplet interconnects make it easier to combine compute, I/O, memory, and accelerators from different design teams or process nodes.",
    domain: "Semiconductors",
    signalType: "Standards",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "System designers will need stronger vocabulary around die-to-die links, latency, coherency, and package-level test strategy.",
    tags: ["UCIe", "chiplets", "advanced packaging", "SoC"],
  },
  {
    id: "riscv-vector-embedded-ai",
    title: "RISC-V vector extensions enter embedded AI and DSP discussions",
    summary:
      "Vector-capable RISC-V cores create another path for signal processing and inference workloads without a separate accelerator block.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Toolchain maturity, intrinsics, profiling, and portable kernel design become important when comparing RISC-V against Arm DSP paths.",
    tags: ["RISC-V", "vector", "DSP", "edge AI"],
  },
  {
    id: "thermal-package-codesign",
    title: "Advanced packaging makes thermal co-design a firmware concern",
    summary:
      "Stacked memory, chiplets, and dense edge modules push thermal behavior closer to firmware throttling and workload scheduling decisions.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Firmware teams need telemetry, power modes, dynamic frequency scaling, and graceful degradation plans.",
    tags: ["thermal", "packaging", "DVFS", "telemetry"],
  },
  {
    id: "zonal-vehicle-compute",
    title: "Automotive zonal controllers consolidate distributed ECUs",
    summary:
      "Vehicle architectures are moving from many small function-specific ECUs toward zonal gateways and central compute domains.",
    domain: "Semiconductors",
    signalType: "Company Move",
    momentum: "Accelerating",
    horizon: "1-3 years",
    impact:
      "Interview prep should cover CAN FD, Ethernet, safety islands, boot timing, and mixed-criticality software partitioning.",
    tags: ["zonal architecture", "CAN FD", "automotive Ethernet", "ASIL"],
  },
  {
    id: "mcu-root-of-trust-default",
    title: "MCU roots of trust move from premium feature to default expectation",
    summary:
      "Connected products increasingly expect secure boot, hardware keys, debug lockdown, attestation, and signed update flows.",
    domain: "Semiconductors",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Security is becoming a baseline embedded topic alongside interrupts, memory maps, and communication peripherals.",
    tags: ["secure boot", "root of trust", "attestation", "OTA"],
  },
  {
    id: "silicon-photonics-ai-systems",
    title: "Silicon photonics changes the accelerator system bottleneck",
    summary:
      "Optical links are gaining attention as accelerator clusters run into power and bandwidth limits from electrical interconnects.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "2-5 years",
    impact:
      "The useful skill is not optical design alone, but knowing how interconnect bandwidth changes system software and deployment constraints.",
    tags: ["silicon photonics", "interconnect", "AI clusters", "bandwidth"],
  },
  {
    id: "arm-riscv-sdk-choice",
    title: "Arm and RISC-V competition makes SDK portability more valuable",
    summary:
      "Architecture choice is expanding, but teams still need reliable drivers, RTOS ports, debug tools, and long-term vendor support.",
    domain: "Semiconductors",
    signalType: "Supply Chain",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Portable HAL design and clean board-support boundaries are becoming career-relevant design habits.",
    tags: ["Arm", "RISC-V", "SDK", "HAL"],
  },
  {
    id: "efpga-industrial-silicon",
    title: "eFPGA blocks return for configurable industrial silicon",
    summary:
      "Embedded FPGA fabric gives SoCs a way to adapt interfaces, timing paths, and accelerators after silicon is manufactured.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Hardware/software co-design skills become useful even for firmware roles that do not write RTL full time.",
    tags: ["eFPGA", "RTL", "industrial SoC", "co-design"],
  },
  {
    id: "gan-sic-motor-drives",
    title: "GaN and SiC power devices reshape motor-drive firmware",
    summary:
      "Wide-bandgap devices enable faster switching and higher efficiency, but they raise control-loop, sensing, and EMI challenges.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Accelerating",
    horizon: "1-3 years",
    impact:
      "Motor-control engineers need power electronics context, sampling discipline, and practical EMI debugging skills.",
    tags: ["GaN", "SiC", "motor control", "EMI"],
  },
  {
    id: "regional-fab-qualification",
    title: "Regional fab investment changes product qualification workflows",
    summary:
      "More geographic diversity in semiconductor manufacturing can reduce risk, but it also creates qualification and sourcing complexity.",
    domain: "Semiconductors",
    signalType: "Supply Chain",
    momentum: "Watching",
    horizon: "2-5 years",
    impact:
      "Long-life products need stronger revision control, validation planning, and alternate-source readiness.",
    tags: ["fabs", "qualification", "supply chain", "BOM"],
  },
  {
    id: "edge-high-speed-io",
    title: "USB4, PCIe, and MIPI push high-speed validation into edge devices",
    summary:
      "Cameras, storage, networking, and accelerator modules are making signal integrity and protocol validation more common in embedded products.",
    domain: "Semiconductors",
    signalType: "Standards",
    momentum: "Emerging",
    horizon: "1-3 years",
    impact:
      "Embedded candidates benefit from knowing traces, eye diagrams, driver bring-up, and bandwidth budgeting at a practical level.",
    tags: ["USB4", "PCIe", "MIPI", "signal integrity"],
  },
  {
    id: "open-eda-education",
    title: "Open-source EDA improves early silicon prototyping and education",
    summary:
      "Open tooling is making digital design, verification, and small silicon projects more accessible to embedded engineers.",
    domain: "Semiconductors",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Firmware engineers can stand out by understanding the hardware pipeline from RTL to board bring-up.",
    tags: ["open EDA", "verification", "RTL", "prototyping"],
  },
  {
    id: "compiler-runtime-ai-silicon",
    title: "AI accelerator competition shifts toward compilers and runtimes",
    summary:
      "Raw TOPS numbers matter less when model support, operator coverage, profiling, and deployment tooling lag behind.",
    domain: "Semiconductors",
    signalType: "Company Move",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "The practical skill is turning models into reliable shipped workloads, not just recognizing accelerator names.",
    tags: ["compiler", "runtime", "AI accelerator", "profiling"],
  },
  {
    id: "ros2-production-hardening",
    title: "ROS 2 hardens from research middleware into production infrastructure",
    summary:
      "More robotics teams are wrapping ROS 2 with deterministic executors, monitoring, lifecycle nodes, and deployment discipline.",
    domain: "Robotics",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Knowing ROS 2 basics is no longer enough; production roles ask about reliability, timing, and observability.",
    tags: ["ROS 2", "DDS", "lifecycle nodes", "observability"],
  },
  {
    id: "humanoid-actuator-reliability",
    title: "Humanoid pilots expose actuator reliability and serviceability gaps",
    summary:
      "Humanoid robots create attention, but durable joints, thermal limits, cabling, battery life, and field repair drive real deployment.",
    domain: "Robotics",
    signalType: "Company Move",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Robotics candidates should connect flashy autonomy demos to motors, sensors, power, reliability, and maintenance.",
    tags: ["humanoids", "actuators", "reliability", "serviceability"],
  },
  {
    id: "amr-multisensor-safety",
    title: "AMRs adopt layered perception and safety stacks",
    summary:
      "Autonomous mobile robots are combining lidar, cameras, bump sensors, maps, and certified safety controllers.",
    domain: "Robotics",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Strong engineers can describe how perception confidence, stop zones, and safety-rated hardware interact.",
    tags: ["AMR", "lidar", "safety", "sensor fusion"],
  },
  {
    id: "tactile-manipulation",
    title: "Tactile sensing expands dexterous manipulation beyond vision",
    summary:
      "Grippers and robot hands are adding force, pressure, and slip sensing to handle deformable or reflective objects.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Sensor fusion and control loops become more important than vision-only manipulation pipelines.",
    tags: ["tactile sensing", "grippers", "force control", "manipulation"],
  },
  {
    id: "depth-camera-commoditization",
    title: "Lower-cost depth cameras commoditize basic robot perception",
    summary:
      "Stereo, structured-light, and time-of-flight modules are making 3D perception easier to prototype.",
    domain: "Robotics",
    signalType: "Chip Release",
    momentum: "Watching",
    horizon: "Now",
    impact:
      "The differentiator shifts from having depth data to calibrating, filtering, and using it reliably in edge cases.",
    tags: ["depth camera", "3D perception", "calibration", "edge cases"],
  },
  {
    id: "sim2real-workflows",
    title: "Simulation-to-real workflows become a robotics hiring differentiator",
    summary:
      "Digital environments help train, test, and validate robots before hardware is available, but transfer gaps remain difficult.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Accelerating",
    horizon: "1-3 years",
    impact:
      "Candidates who can discuss domain randomization, hardware-in-loop, and validation metrics have a stronger story.",
    tags: ["simulation", "sim2real", "HIL", "validation"],
  },
  {
    id: "robot-fleet-identity",
    title: "Robot fleets need identity, update, and incident-response systems",
    summary:
      "Robots are becoming managed edge devices with certificates, software bills of materials, signed updates, and fleet telemetry.",
    domain: "Robotics",
    signalType: "Supply Chain",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Security and operations literacy can separate robotics engineers from demo-only builders.",
    tags: ["fleet management", "OTA", "identity", "SBOM"],
  },
  {
    id: "robot-battery-orchestration",
    title: "Battery health and charging orchestration become autonomy constraints",
    summary:
      "Warehouse and field robots must plan around charging windows, battery aging, thermal limits, and task priority.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Power-aware scheduling and battery telemetry are becoming practical robotics systems topics.",
    tags: ["battery", "charging", "fleet scheduling", "telemetry"],
  },
  {
    id: "robot-real-time-ethernet",
    title: "Real-time Ethernet reaches more robot cells and motion systems",
    summary:
      "EtherCAT, PROFINET IRT, and TSN-style networks are increasingly relevant where robots interact with conveyors, drives, and safety gear.",
    domain: "Robotics",
    signalType: "Standards",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Robotics engineers benefit from industrial networking knowledge, not only path planning and perception.",
    tags: ["EtherCAT", "PROFINET", "TSN", "motion control"],
  },
  {
    id: "vla-control-boundary",
    title: "Vision-language-action models remain bounded by real-time control",
    summary:
      "AI planners can improve robot flexibility, but safe actuation still depends on deterministic controllers and verified limits.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "The valuable skill is bridging AI outputs to constrained control actions with monitoring and recovery.",
    tags: ["VLA models", "controls", "safety", "autonomy"],
  },
  {
    id: "cobot-force-control",
    title: "Force-controlled cobots expand into smaller production cells",
    summary:
      "Collaborative robots are becoming more useful as force sensing, motion planning, and safety configuration improve.",
    domain: "Robotics",
    signalType: "Company Move",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Practical robot work requires understanding payloads, end effectors, safety-rated stops, and human workflow design.",
    tags: ["cobots", "force control", "end effectors", "safety"],
  },
  {
    id: "semantic-slam",
    title: "SLAM shifts from geometry-only maps toward semantic scene understanding",
    summary:
      "Robots need maps that encode doors, shelves, people, zones, and task-relevant objects, not just points and planes.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Computer vision, mapping, and product requirements are merging in autonomy interviews.",
    tags: ["SLAM", "semantic maps", "perception", "autonomy"],
  },
  {
    id: "edge-modules-cheaper-autonomy",
    title: "Edge GPU and NPU modules make local autonomy cheaper",
    summary:
      "Module ecosystems reduce the cost of deploying perception and planning without building custom compute boards.",
    domain: "Robotics",
    signalType: "Chip Release",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Robotics engineers should know module power budgets, camera pipelines, thermal behavior, and accelerator APIs.",
    tags: ["edge GPU", "NPU", "Jetson", "camera pipeline"],
  },
  {
    id: "mpc-accessibility",
    title: "Model predictive control becomes more accessible in robotics products",
    summary:
      "Better solvers, libraries, and compute make MPC more practical for dynamic robots and constrained motion planning.",
    domain: "Robotics",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Control theory fundamentals become more useful when paired with practical compute and latency awareness.",
    tags: ["MPC", "control theory", "optimization", "latency"],
  },
  {
    id: "robot-data-teleoperation",
    title: "Robot data pipelines and teleoperation become product infrastructure",
    summary:
      "Field robots need logging, replay, remote assistance, dataset capture, and privacy-aware data handling.",
    domain: "Robotics",
    signalType: "Company Move",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Robotics teams need engineers who can build reliable data loops around deployed hardware.",
    tags: ["teleoperation", "data pipeline", "logging", "dataset"],
  },
  {
    id: "rt-linux-robotics",
    title: "Deterministic Linux kernels become normal in advanced robot stacks",
    summary:
      "PREEMPT_RT, CPU isolation, and careful scheduling help teams run rich Linux software near hard timing boundaries.",
    domain: "Robotics",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Real-time Linux knowledge is becoming a practical robotics skill, not just a niche systems topic.",
    tags: ["real-time Linux", "PREEMPT_RT", "scheduling", "latency"],
  },
  {
    id: "opcua-fx-field-level",
    title: "OPC UA FX pushes interoperable automation toward field devices",
    summary:
      "Field-level communication aims to make controllers, drives, sensors, and machines easier to model and exchange across vendors.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Emerging",
    horizon: "2-5 years",
    impact:
      "Automation roles increasingly value data modeling and protocol literacy alongside ladder logic.",
    tags: ["OPC UA FX", "field devices", "data modeling", "interoperability"],
  },
  {
    id: "tsn-industrial-networking",
    title: "TSN adoption raises the bar for deterministic industrial Ethernet",
    summary:
      "Time-sensitive networking promises converged traffic for control, safety, and data without separate networks for every function.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Watching",
    horizon: "2-5 years",
    impact:
      "Engineers should understand latency budgets, clock sync, traffic classes, and where TSN is worth the complexity.",
    tags: ["TSN", "industrial Ethernet", "PTP", "determinism"],
  },
  {
    id: "mqtt-sparkplug",
    title: "MQTT Sparkplug standardizes factory telemetry payloads",
    summary:
      "Sparkplug adds state management and topic conventions that make MQTT more useful for industrial systems.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "IoT and automation skill sets are converging around reliable messaging, schemas, and edge gateways.",
    tags: ["MQTT Sparkplug", "telemetry", "edge gateway", "schemas"],
  },
  {
    id: "iec62443-procurement",
    title: "IEC 62443 becomes a procurement filter for connected machines",
    summary:
      "Security standards are moving from optional best practice to a requirement in more industrial buying decisions.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Automation engineers need to speak about zones, conduits, secure development, patching, and remote access controls.",
    tags: ["IEC 62443", "OT security", "remote access", "secure development"],
  },
  {
    id: "edge-plc-convergence",
    title: "Edge PLCs blend deterministic control with Linux-side apps",
    summary:
      "New controllers are combining PLC runtimes with containers, analytics, and protocol gateways at the machine edge.",
    domain: "Automation",
    signalType: "Chip Release",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "The useful skill is knowing where real-time control ends and edge software services begin.",
    tags: ["edge PLC", "containers", "Linux", "machine edge"],
  },
  {
    id: "edge-predictive-maintenance",
    title: "Predictive maintenance moves closer to drives, sensors, and gateways",
    summary:
      "Condition monitoring is shifting from batch analytics to local vibration, current, temperature, and acoustic inference.",
    domain: "Automation",
    signalType: "Emerging Tech",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Signal processing, anomaly detection, and sensor-placement reasoning matter for automation portfolios.",
    tags: ["predictive maintenance", "vibration", "anomaly detection", "edge AI"],
  },
  {
    id: "digital-twin-live-control",
    title: "Digital twins connect more tightly to live control data",
    summary:
      "Models are moving beyond static simulation toward live state, operational context, and what-if analysis tied to machines.",
    domain: "Automation",
    signalType: "Emerging Tech",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Engineers who can connect PLC tags, historians, and simulation assumptions will be more valuable.",
    tags: ["digital twin", "PLC tags", "historian", "simulation"],
  },
  {
    id: "line-side-vision-inspection",
    title: "Line-side computer vision becomes a standard quality tool",
    summary:
      "Factories are deploying cameras and edge inference for defect detection, measurement, sorting, and traceability.",
    domain: "Automation",
    signalType: "Chip Release",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Computer vision skills need to include lighting, triggering, latency, calibration, and false-reject economics.",
    tags: ["machine vision", "quality", "edge inference", "calibration"],
  },
  {
    id: "low-code-scada",
    title: "Low-code SCADA and HMI tools speed deployment but hide complexity",
    summary:
      "Configuration-heavy tools are helping teams build dashboards faster while still requiring rigorous alarm, security, and data design.",
    domain: "Automation",
    signalType: "Company Move",
    momentum: "Watching",
    horizon: "Now",
    impact:
      "Candidates should show they understand the engineering behind the screen, not just drag-and-drop interfaces.",
    tags: ["SCADA", "HMI", "alarms", "low-code"],
  },
  {
    id: "brownfield-retrofits",
    title: "Brownfield retrofit work dominates many automation upgrades",
    summary:
      "Most factories cannot replace everything at once, so modernization depends on gateways, protocol bridges, and careful cutovers.",
    domain: "Automation",
    signalType: "Supply Chain",
    momentum: "Watching",
    horizon: "Now",
    impact:
      "Practical automation engineers need patience with legacy protocols, documentation gaps, and downtime constraints.",
    tags: ["brownfield", "retrofit", "protocol bridge", "downtime"],
  },
  {
    id: "functional-safety-ethernet",
    title: "Functional safety over Ethernet grows in advanced machines",
    summary:
      "Safety traffic is increasingly integrated with industrial Ethernet stacks rather than wired separately for every function.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Emerging",
    horizon: "1-3 years",
    impact:
      "Understanding safety integrity, diagnostics, and deterministic networks helps engineers design credible machine systems.",
    tags: ["functional safety", "Ethernet", "SIL", "diagnostics"],
  },
  {
    id: "factory-energy-kpi",
    title: "Energy optimization becomes a core factory automation KPI",
    summary:
      "Rising energy costs and sustainability goals are pushing controls teams to optimize motors, compressed air, HVAC, and idle states.",
    domain: "Automation",
    signalType: "Company Move",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Controls work increasingly intersects with power measurement, scheduling, and production economics.",
    tags: ["energy", "motor drives", "optimization", "sustainability"],
  },
  {
    id: "historian-ai-assistants",
    title: "Process historians become data sources for AI assistants",
    summary:
      "Time-series data, alarms, maintenance notes, and engineering documents are being connected to troubleshooting copilots.",
    domain: "Automation",
    signalType: "Emerging Tech",
    momentum: "Emerging",
    horizon: "1-3 years",
    impact:
      "Data quality, tag naming, security, and explainability are becoming automation architecture issues.",
    tags: ["historian", "AI assistant", "time series", "troubleshooting"],
  },
  {
    id: "virtual-commissioning",
    title: "Virtual commissioning reduces machine startup risk",
    summary:
      "Simulation and emulation let controls teams test PLC logic, motion, safety, and HMI flows before equipment arrives.",
    domain: "Automation",
    signalType: "Emerging Tech",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "PLC skills pair well with simulation, test cases, and a software-style validation mindset.",
    tags: ["virtual commissioning", "PLC", "simulation", "validation"],
  },
  {
    id: "machine-builder-ota",
    title: "Machine builders bundle remote service and OTA update systems",
    summary:
      "OEMs are turning shipped machines into managed products with diagnostics, patches, backups, and support portals.",
    domain: "Automation",
    signalType: "Company Move",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Secure remote access, rollback, observability, and customer trust become part of automation product design.",
    tags: ["remote service", "OTA", "diagnostics", "OEM"],
  },
  {
    id: "private-5g-redcap-factory",
    title: "Private 5G and RedCap target mobile factory assets",
    summary:
      "Wireless industrial networks are improving for AGVs, sensors, tablets, and temporary production cells.",
    domain: "Automation",
    signalType: "Standards",
    momentum: "Watching",
    horizon: "1-3 years",
    impact:
      "Automation engineers should compare wireless options by latency, roaming, coverage, security, and lifecycle cost.",
    tags: ["private 5G", "RedCap", "AGV", "wireless"],
  },
  {
    id: "mes-erp-machine-context",
    title: "MES and ERP integration pulls machine context into business systems",
    summary:
      "Production data is increasingly expected to flow from machines into scheduling, traceability, quality, and inventory systems.",
    domain: "Automation",
    signalType: "Company Move",
    momentum: "Watching",
    horizon: "Now",
    impact:
      "The strongest automation engineers can map tags and events to actual business decisions.",
    tags: ["MES", "ERP", "traceability", "production data"],
  },
  {
    id: "ot-asset-inventory",
    title: "Cyber-physical asset inventory becomes a prerequisite for OT security",
    summary:
      "Factories cannot secure, patch, or segment equipment they cannot identify and classify.",
    domain: "Automation",
    signalType: "Supply Chain",
    momentum: "Accelerating",
    horizon: "Now",
    impact:
      "Network discovery, device identity, and change control are becoming practical automation skills.",
    tags: ["asset inventory", "OT security", "segmentation", "change control"],
  },
];

const TREND_SIGNAL_LENSES = [
  {
    id: "market",
    title: (seed: TrendExpansionSeed) => seed.title,
    summary: (seed: TrendExpansionSeed) => seed.summary,
    impact: (seed: TrendExpansionSeed) => seed.impact,
    tags: (seed: TrendExpansionSeed) => seed.tags,
  },
  {
    id: "hiring",
    title: (seed: TrendExpansionSeed) => `Hiring watch: ${seed.title}`,
    summary: (seed: TrendExpansionSeed) =>
      `${seed.summary} Hiring screens are likely to turn this into architecture, tradeoff, debugging, or systems-design questions.`,
    impact: (seed: TrendExpansionSeed) =>
      `Prepare a concise interview story around ${seed.tags.slice(0, 3).join(", ")} and connect it to real product constraints.`,
    tags: (seed: TrendExpansionSeed) => [...seed.tags.slice(0, 4), "hiring signal", "interview prep"],
  },
  {
    id: "portfolio",
    title: (seed: TrendExpansionSeed) => `Portfolio angle: ${seed.title}`,
    summary: (seed: TrendExpansionSeed) =>
      `${seed.summary} A small demo, teardown, simulation, or design note can make this trend concrete in a portfolio.`,
    impact: (seed: TrendExpansionSeed) =>
      `Build proof of skill with a scoped project that shows measurement, constraints, and a clear engineering decision around ${seed.tags[0]}.`,
    tags: (seed: TrendExpansionSeed) => [...seed.tags.slice(0, 4), "portfolio", "project idea"],
  },
] as const;

const EXPANDED_CURATED_TREND_SIGNALS: IndustryTrendSignal[] = TREND_EXPANSION_SEEDS.flatMap((seed) =>
  TREND_SIGNAL_LENSES.map((lens) => ({
    id: `${seed.id}-${lens.id}`,
    title: lens.title(seed),
    summary: lens.summary(seed),
    domain: seed.domain,
    signalType: seed.signalType,
    momentum: seed.momentum,
    horizon: seed.horizon,
    impact: lens.impact(seed),
    tags: lens.tags(seed),
    sourceName: "Curated baseline",
  }))
);

export const CURATED_TREND_SIGNALS: IndustryTrendSignal[] = [
  ...BASE_CURATED_TREND_SIGNALS,
  ...EXPANDED_CURATED_TREND_SIGNALS,
];

const BASE_TREND_FORECASTS: TrendForecast[] = [
  {
    id: "heterogeneous-edge",
    title: "Heterogeneous edge compute becomes the default embedded architecture",
    direction: "Gaining traction",
    domain: "Cross-industry",
    timeframe: "1-3 years",
    confidence: 88,
    summary:
      "More products will combine CPUs, MCUs, DSPs, NPUs, GPUs, and programmable logic instead of relying on one general-purpose processor.",
    whyItMatters:
      "The bottleneck is shifting from raw code correctness to partitioning workloads across memory, power, latency, and safety constraints.",
    signals: ["Edge AI roadmaps", "AI MCU launches", "robotics perception pipelines", "industrial gateways"],
    skills: ["accelerator SDKs", "DMA and memory hierarchy", "RTOS plus Linux partitioning", "profiling"],
    watchouts: ["vendor lock-in", "debug complexity", "thermal margins"],
  },
  {
    id: "riscv-open-isa",
    title: "RISC-V grows where customization and cost control matter",
    direction: "Gaining traction",
    domain: "Semiconductors",
    timeframe: "2-5 years",
    confidence: 78,
    summary:
      "RISC-V is most likely to gain durable share in embedded controllers, security islands, AI support cores, and highly customized SoCs.",
    whyItMatters:
      "Even teams that do not design silicon will touch new compiler targets, boot flows, debug probes, and vendor SDKs.",
    signals: ["custom SoCs", "open ISA ecosystems", "university-to-industry talent flow"],
    skills: ["GCC/LLVM toolchains", "assembly reading", "board bring-up", "architecture tradeoff analysis"],
    watchouts: ["fragmented extensions", "maturing software ecosystem", "certification timelines"],
  },
  {
    id: "robotics-safety-ai",
    title: "Robotics roles split between AI autonomy and certifiable control",
    direction: "Gaining traction",
    domain: "Robotics",
    timeframe: "1-3 years",
    confidence: 84,
    summary:
      "Companies will keep adding AI planning and perception, but shipped systems will still be judged by safe stops, determinism, and recoverability.",
    whyItMatters:
      "The career edge is not only knowing ML or controls. It is knowing how to connect them without losing safety guarantees.",
    signals: ["ROS 2 adoption", "warehouse autonomy", "humanoid pilots", "safety-rated robot cells"],
    skills: ["ROS 2", "control theory", "sensor fusion", "functional safety", "real-time Linux"],
    watchouts: ["demo-to-production gap", "edge-case validation", "model drift"],
  },
  {
    id: "ot-it-convergence",
    title: "Industrial automation shifts from isolated PLC cells to secure data platforms",
    direction: "Gaining traction",
    domain: "Automation",
    timeframe: "0-12 months",
    confidence: 86,
    summary:
      "Factories are connecting PLCs, drives, historians, MES, cloud analytics, and digital twins through standardized secure interfaces.",
    whyItMatters:
      "Automation engineers increasingly need to reason about networks, identity, data contracts, and uptime at the same time.",
    signals: ["OPC UA", "MQTT Sparkplug", "IEC 62443", "predictive maintenance"],
    skills: ["industrial networking", "secure update design", "SCADA/HMI", "time-series data", "threat modeling"],
    watchouts: ["legacy equipment", "availability requirements", "vendor-specific tooling"],
  },
  {
    id: "bare-metal-only",
    title: "Bare-metal-only product stacks lose ground in connected systems",
    direction: "Losing momentum",
    domain: "Cross-industry",
    timeframe: "2-5 years",
    confidence: 72,
    summary:
      "Bare metal remains important for tiny, safety-critical, and cost-sensitive designs, but connected products need richer scheduling, security, and update flows.",
    whyItMatters:
      "Interviewers will still test low-level fundamentals, but they will expect you to know when an RTOS, MPU, or Linux split is the better architecture.",
    signals: ["OTA requirements", "secure boot", "multi-protocol products", "field telemetry"],
    skills: ["RTOS design", "bootloaders", "fault isolation", "observability"],
    watchouts: ["overengineering small products", "certification constraints", "RAM footprint"],
  },
];

type ForecastLens = {
  id: string;
  titlePrefix: string;
  confidenceDelta: number;
  signal: string;
  skill: string;
  watchout: string;
  timeframe: TrendForecast["timeframe"];
  direction: TrendForecast["direction"];
  summary: (seed: TrendExpansionSeed) => string;
  whyItMatters: (seed: TrendExpansionSeed) => string;
};

const FORECAST_LENSES: ForecastLens[] = [
  {
    id: "architecture",
    titlePrefix: "Architecture forecast",
    confidenceDelta: 4,
    signal: "architecture roadmaps",
    skill: "system partitioning",
    watchout: "integration complexity",
    timeframe: "1-3 years",
    direction: "Gaining traction",
    summary: (seed) =>
      `${seed.title} is likely to influence architecture decisions as teams balance performance, power, safety, cost, and lifecycle risk.`,
    whyItMatters: (seed) =>
      `This matters because ${seed.impact.charAt(0).toLowerCase()}${seed.impact.slice(1)} The practical edge is explaining the tradeoff, not just naming the trend.`,
  },
  {
    id: "skills",
    titlePrefix: "Skills forecast",
    confidenceDelta: 1,
    signal: "job descriptions and interview loops",
    skill: "hands-on implementation",
    watchout: "resume keyword inflation",
    timeframe: "1-3 years",
    direction: "Gaining traction",
    summary: (seed) =>
      `The skill market around ${seed.tags.slice(0, 2).join(" and ")} should grow as this trend moves from prototypes into production workflows.`,
    whyItMatters: (seed) =>
      `Candidates can turn ${seed.title.toLowerCase()} into stronger interview evidence by showing measured constraints, failure modes, and debugging depth.`,
  },
  {
    id: "adoption",
    titlePrefix: "Adoption forecast",
    confidenceDelta: -2,
    signal: "supplier roadmaps and product launches",
    skill: "technology evaluation",
    watchout: "pilot-to-production gap",
    timeframe: "2-5 years",
    direction: "Gaining traction",
    summary: (seed) =>
      `${seed.title} should see uneven adoption: fast in teams with clear ROI, slower where certification, integration, or supply risk dominates.`,
    whyItMatters: (seed) =>
      `The right forecast is not yes-or-no adoption. It is knowing which ${seed.domain.toLowerCase()} products benefit first and which constraints delay rollout.`,
  },
  {
    id: "risk",
    titlePrefix: "Risk forecast",
    confidenceDelta: -6,
    signal: "field failures, security reviews, and validation cost",
    skill: "risk-driven design review",
    watchout: "overcommitting before ecosystem maturity",
    timeframe: "2-5 years",
    direction: "Stable demand",
    summary: (seed) =>
      `${seed.title} will create new reliability, security, validation, or maintainability questions as deployments scale.`,
    whyItMatters: (seed) =>
      `Forecasting the risk side helps separate durable engineering bets from hype. Watch ${seed.tags.slice(0, 3).join(", ")} for maturity signals.`,
  },
];

function forecastConfidence(seed: TrendExpansionSeed, lens: ForecastLens) {
  const momentumBase: Record<TrendMomentum, number> = {
    Accelerating: 84,
    Emerging: 76,
    Watching: 70,
  };

  const typeBoost: Record<TrendSignalType, number> = {
    "Chip Release": 3,
    "Supply Chain": 1,
    "Company Move": 2,
    "Emerging Tech": 0,
    Standards: 4,
  };

  return Math.max(58, Math.min(94, momentumBase[seed.momentum] + typeBoost[seed.signalType] + lens.confidenceDelta));
}

const GENERATED_TREND_FORECASTS: TrendForecast[] = TREND_EXPANSION_SEEDS.flatMap((seed) =>
  FORECAST_LENSES.map((lens) => ({
    id: `${seed.id}-${lens.id}-forecast`,
    title: `${lens.titlePrefix}: ${seed.title}`,
    direction: lens.direction,
    domain: seed.domain,
    timeframe: lens.timeframe,
    confidence: forecastConfidence(seed, lens),
    summary: lens.summary(seed),
    whyItMatters: lens.whyItMatters(seed),
    signals: [
      lens.signal,
      seed.signalType,
      seed.momentum,
      ...seed.tags.slice(0, 2),
    ],
    skills: [
      lens.skill,
      ...seed.tags.slice(0, 3),
      seed.domain === "Automation"
        ? "industrial systems thinking"
        : seed.domain === "Robotics"
          ? "robotics systems debugging"
          : "silicon-aware embedded design",
    ],
    watchouts: [
      lens.watchout,
      seed.horizon,
      seed.signalType === "Supply Chain" ? "supplier volatility" : "ecosystem maturity",
    ],
  }))
);

export const TREND_FORECASTS: TrendForecast[] = [
  ...BASE_TREND_FORECASTS,
  ...GENERATED_TREND_FORECASTS,
];

export const SKILLS_FORECAST: SkillForecast[] = [
  {
    skill: "Edge AI deployment",
    demand: "Critical",
    timeframe: "Now",
    domains: ["Semiconductors", "Robotics", "Automation"],
    reason:
      "Quantization, accelerator runtimes, and memory-aware inference are becoming standard in sensors, robots, cameras, and gateways.",
  },
  {
    skill: "Secure firmware lifecycle",
    demand: "Critical",
    timeframe: "Now",
    domains: ["Semiconductors", "Automation"],
    reason:
      "Secure boot, signed OTA, device identity, SBOMs, and vulnerability response are moving into baseline product requirements.",
  },
  {
    skill: "Real-time Linux and ROS 2",
    demand: "High",
    timeframe: "1-3 years",
    domains: ["Robotics", "Automation"],
    reason:
      "Robots and advanced machines need Linux ecosystems with deterministic behavior, hardware timing, and safety-aware supervision.",
  },
  {
    skill: "Industrial networking",
    demand: "High",
    timeframe: "Now",
    domains: ["Automation", "Robotics"],
    reason:
      "OPC UA, TSN, EtherCAT, PROFINET, CAN FD, and MQTT are central to modern machine integration.",
  },
  {
    skill: "Architecture-aware debugging",
    demand: "Rising",
    timeframe: "2-5 years",
    domains: ["Semiconductors", "Robotics"],
    reason:
      "Heterogeneous systems make issues appear across caches, DMA, interconnects, accelerators, and mixed-criticality boundaries.",
  },
  {
    skill: "Supply-chain-aware design",
    demand: "Rising",
    timeframe: "1-3 years",
    domains: ["Semiconductors", "Automation"],
    reason:
      "Long-life products increasingly need portable HALs, alternate parts, and BOM risk reviews built into engineering decisions.",
  },
];

export const DECLINING_TECHNOLOGIES: DecliningTechnology[] = [
  {
    name: "Closed fieldbus-only automation islands",
    pressure: "High",
    replacement: "OPC UA, MQTT Sparkplug, TSN, and secure industrial Ethernet",
    note:
      "Legacy buses will remain in plants, but new systems are expected to expose richer, secure, interoperable data.",
  },
  {
    name: "Cloud-only inference for latency-critical machines",
    pressure: "High",
    replacement: "Edge AI on MCUs, NPUs, GPUs, and industrial gateways",
    note:
      "Cloud training and analytics stay important, but control-adjacent decisions are moving closer to the machine.",
  },
  {
    name: "Firmware without signed updates or device identity",
    pressure: "High",
    replacement: "Secure boot, signed OTA, hardware roots of trust, and fleet identity",
    note:
      "Connected products increasingly need a defensible lifecycle after shipment.",
  },
  {
    name: "Single-vendor MCU assumptions in long-life products",
    pressure: "Medium",
    replacement: "Portable driver layers, second-source planning, and abstraction around RTOS/HAL choices",
    note:
      "The lesson from supply disruption is that availability needs to be designed into the product, not patched later.",
  },
];
