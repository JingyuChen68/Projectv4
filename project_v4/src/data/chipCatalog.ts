export type ChipCategory =
  | "Wireless MCU"
  | "General Purpose MCU"
  | "Performance MCU"
  | "Ultra Low Power MCU"
  | "Motor Control MCU"
  | "Secure MCU";

export type Connectivity =
  | "Wi-Fi"
  | "Bluetooth LE"
  | "Thread"
  | "Zigbee"
  | "Ethernet"
  | "USB"
  | "CAN"
  | "I2C"
  | "SPI"
  | "UART"
  | "NFC"
  | "PIO";

export interface ChipSpec {
  id: string;
  name: string;
  manufacturer: string;
  partNumber: string;
  category: ChipCategory;
  architecture: string;
  core: string;
  clockMHz: number;
  coreMark: number;
  flashKB: number;
  sramKB: number;
  psramMB?: number;
  gpio: number;
  adcBits: number;
  operatingVoltage: string;
  package: string;
  power: {
    activeMa: number;
    sleepUa: number;
  };
  connectivity: Connectivity[];
  peripherals: string[];
  strengths: string[];
  useCases: string[];
  notes: string;
}

export interface ChipPriceSnapshot {
  partNumber: string;
  distributor: string;
  unitPriceUsd: number;
  stock: number;
  leadTimeWeeks: number;
  packaging: string;
  source: string;
  updatedAt?: string;
}

export const CONNECTIVITY_OPTIONS: Connectivity[] = [
  "Wi-Fi",
  "Bluetooth LE",
  "Thread",
  "Zigbee",
  "Ethernet",
  "USB",
  "CAN",
  "I2C",
  "SPI",
  "UART",
  "NFC",
  "PIO",
];

export const USE_CASE_PRESETS = [
  "IoT sensor node",
  "robot motor controller",
  "BLE wearable",
  "edge gateway",
  "audio DSP board",
  "student dev board",
];

export const CHIP_CATALOG: ChipSpec[] = [
  {
    id: "esp32-s3",
    name: "ESP32-S3-WROOM-1",
    manufacturer: "Espressif",
    partNumber: "ESP32-S3-WROOM-1-N8R8",
    category: "Wireless MCU",
    architecture: "Xtensa LX7",
    core: "Dual-core 32-bit",
    clockMHz: 240,
    coreMark: 1181,
    flashKB: 8192,
    sramKB: 512,
    psramMB: 8,
    gpio: 45,
    adcBits: 12,
    operatingVoltage: "3.0V - 3.6V",
    package: "Module",
    power: { activeMa: 85, sleepUa: 8 },
    connectivity: ["Wi-Fi", "Bluetooth LE", "USB", "I2C", "SPI", "UART"],
    peripherals: ["LCD interface", "camera interface", "touch", "PWM", "I2S"],
    strengths: ["Wireless prototyping", "AI/audio experiments", "large community"],
    useCases: ["IoT sensor node", "edge gateway", "audio DSP board", "student dev board"],
    notes: "Strong default when Wi-Fi, BLE, USB, and ample external memory matter more than lowest sleep current.",
  },
  {
    id: "rp2040",
    name: "RP2040",
    manufacturer: "Raspberry Pi",
    partNumber: "RP2040",
    category: "General Purpose MCU",
    architecture: "Arm Cortex-M0+",
    core: "Dual-core 32-bit",
    clockMHz: 133,
    coreMark: 635,
    flashKB: 0,
    sramKB: 264,
    gpio: 30,
    adcBits: 12,
    operatingVoltage: "1.8V - 3.3V",
    package: "QFN-56",
    power: { activeMa: 23, sleepUa: 180 },
    connectivity: ["USB", "I2C", "SPI", "UART", "PIO"],
    peripherals: ["PIO state machines", "PWM", "USB device/host", "timer"],
    strengths: ["PIO flexibility", "low unit cost", "great for teaching"],
    useCases: ["student dev board", "robot motor controller", "data logger"],
    notes: "No internal flash or radio, but PIO makes awkward digital protocols and custom timing much easier.",
  },
  {
    id: "stm32h743",
    name: "STM32H743ZI",
    manufacturer: "STMicroelectronics",
    partNumber: "STM32H743ZIT6",
    category: "Performance MCU",
    architecture: "Arm Cortex-M7",
    core: "Single-core 32-bit",
    clockMHz: 480,
    coreMark: 3224,
    flashKB: 2048,
    sramKB: 1024,
    gpio: 114,
    adcBits: 16,
    operatingVoltage: "1.62V - 3.6V",
    package: "LQFP-144",
    power: { activeMa: 120, sleepUa: 2.5 },
    connectivity: ["Ethernet", "USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["FPU", "DSP", "camera interface", "SDMMC", "crypto"],
    strengths: ["High compute", "rich peripherals", "industrial connectivity"],
    useCases: ["edge gateway", "audio DSP board", "robot motor controller"],
    notes: "A heavyweight MCU for high-throughput control, networking, and signal-processing workloads.",
  },
  {
    id: "stm32l476",
    name: "STM32L476RG",
    manufacturer: "STMicroelectronics",
    partNumber: "STM32L476RGT6",
    category: "Ultra Low Power MCU",
    architecture: "Arm Cortex-M4F",
    core: "Single-core 32-bit",
    clockMHz: 80,
    coreMark: 273,
    flashKB: 1024,
    sramKB: 128,
    gpio: 51,
    adcBits: 12,
    operatingVoltage: "1.71V - 3.6V",
    package: "LQFP-64",
    power: { activeMa: 8, sleepUa: 0.8 },
    connectivity: ["USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["low-power timers", "op-amp", "comparator", "RTC"],
    strengths: ["Battery life", "analog peripherals", "balanced flash"],
    useCases: ["IoT sensor node", "BLE wearable", "data logger"],
    notes: "Good choice for low-power sensor and instrumentation designs that do not need an integrated radio.",
  },
  {
    id: "nrf52840",
    name: "nRF52840",
    manufacturer: "Nordic Semiconductor",
    partNumber: "NRF52840-QIAA-R",
    category: "Wireless MCU",
    architecture: "Arm Cortex-M4F",
    core: "Single-core 32-bit",
    clockMHz: 64,
    coreMark: 212,
    flashKB: 1024,
    sramKB: 256,
    gpio: 48,
    adcBits: 12,
    operatingVoltage: "1.7V - 5.5V",
    package: "aQFN-73",
    power: { activeMa: 15, sleepUa: 0.4 },
    connectivity: ["Bluetooth LE", "Thread", "Zigbee", "USB", "NFC", "I2C", "SPI", "UART"],
    peripherals: ["crypto", "PDM", "PWM", "quadrature decoder"],
    strengths: ["BLE range", "mesh networking", "low sleep current"],
    useCases: ["BLE wearable", "IoT sensor node", "student dev board"],
    notes: "A strong wireless MCU when BLE, Thread, Zigbee, and battery life are central requirements.",
  },
  {
    id: "samd21",
    name: "ATSAMD21G18A",
    manufacturer: "Microchip",
    partNumber: "ATSAMD21G18A-AUT",
    category: "General Purpose MCU",
    architecture: "Arm Cortex-M0+",
    core: "Single-core 32-bit",
    clockMHz: 48,
    coreMark: 142,
    flashKB: 256,
    sramKB: 32,
    gpio: 38,
    adcBits: 12,
    operatingVoltage: "1.62V - 3.63V",
    package: "TQFP-48",
    power: { activeMa: 7, sleepUa: 5 },
    connectivity: ["USB", "I2C", "SPI", "UART"],
    peripherals: ["capacitive touch", "PWM", "RTC", "DMA"],
    strengths: ["USB devices", "beginner boards", "simple firmware"],
    useCases: ["student dev board", "IoT sensor node", "data logger"],
    notes: "Friendly, modest, and widely supported for compact USB-connected embedded projects.",
  },
  {
    id: "atmega328p",
    name: "ATmega328P",
    manufacturer: "Microchip",
    partNumber: "ATMEGA328P-AU",
    category: "General Purpose MCU",
    architecture: "AVR",
    core: "8-bit",
    clockMHz: 20,
    coreMark: 19,
    flashKB: 32,
    sramKB: 2,
    gpio: 23,
    adcBits: 10,
    operatingVoltage: "1.8V - 5.5V",
    package: "TQFP-32",
    power: { activeMa: 9, sleepUa: 0.1 },
    connectivity: ["I2C", "SPI", "UART"],
    peripherals: ["PWM", "timer/counter", "analog comparator"],
    strengths: ["5V tolerance", "tiny firmware", "massive learning ecosystem"],
    useCases: ["student dev board", "simple sensor node", "legacy control"],
    notes: "Still useful for simple 5V control jobs, though memory and compute headroom are tight.",
  },
  {
    id: "imx-rt1062",
    name: "i.MX RT1062",
    manufacturer: "NXP",
    partNumber: "MIMXRT1062DVL6B",
    category: "Performance MCU",
    architecture: "Arm Cortex-M7",
    core: "Single-core 32-bit",
    clockMHz: 600,
    coreMark: 3020,
    flashKB: 0,
    sramKB: 1024,
    gpio: 120,
    adcBits: 12,
    operatingVoltage: "3.0V - 3.6V",
    package: "MAPBGA-196",
    power: { activeMa: 160, sleepUa: 20 },
    connectivity: ["Ethernet", "USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["display controller", "camera interface", "audio PLL", "PWM"],
    strengths: ["Very high clock", "multimedia I/O", "Teensy ecosystem"],
    useCases: ["audio DSP board", "robot motor controller", "edge gateway"],
    notes: "Near-application-processor performance while staying in MCU territory.",
  },
  {
    id: "msp430fr5994",
    name: "MSP430FR5994",
    manufacturer: "Texas Instruments",
    partNumber: "MSP430FR5994IPN",
    category: "Ultra Low Power MCU",
    architecture: "MSP430",
    core: "16-bit",
    clockMHz: 16,
    coreMark: 55,
    flashKB: 0,
    sramKB: 8,
    gpio: 68,
    adcBits: 12,
    operatingVoltage: "1.8V - 3.6V",
    package: "LQFP-80",
    power: { activeMa: 1.5, sleepUa: 0.35 },
    connectivity: ["I2C", "SPI", "UART"],
    peripherals: ["256KB FRAM", "LCD driver", "LEA accelerator", "RTC"],
    strengths: ["Lowest active current", "FRAM endurance", "energy harvesting"],
    useCases: ["IoT sensor node", "data logger", "metering"],
    notes: "Excellent for years-long battery sensing where raw processing power is secondary.",
  },
  {
    id: "lpc55s69",
    name: "LPC55S69",
    manufacturer: "NXP",
    partNumber: "LPC55S69JBD100",
    category: "Secure MCU",
    architecture: "Arm Cortex-M33",
    core: "Dual-core 32-bit",
    clockMHz: 150,
    coreMark: 640,
    flashKB: 640,
    sramKB: 320,
    gpio: 64,
    adcBits: 16,
    operatingVoltage: "1.71V - 3.6V",
    package: "HLQFP-100",
    power: { activeMa: 24, sleepUa: 4 },
    connectivity: ["USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["TrustZone", "crypto", "PUF", "DSP accelerator"],
    strengths: ["Security", "balanced performance", "USB devices"],
    useCases: ["secure sensor hub", "industrial controller", "student dev board"],
    notes: "Useful where secure boot, key storage, and a modern Arm security model matter.",
  },
  {
    id: "pic32mz",
    name: "PIC32MZ EF",
    manufacturer: "Microchip",
    partNumber: "PIC32MZ2048EFH064-I/PT",
    category: "Performance MCU",
    architecture: "MIPS M-class",
    core: "Single-core 32-bit",
    clockMHz: 252,
    coreMark: 654,
    flashKB: 2048,
    sramKB: 512,
    gpio: 53,
    adcBits: 12,
    operatingVoltage: "2.1V - 3.6V",
    package: "TQFP-64",
    power: { activeMa: 135, sleepUa: 45 },
    connectivity: ["Ethernet", "USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["FPU", "crypto", "PMP", "I2S"],
    strengths: ["Ethernet control", "large flash", "Microchip ecosystem"],
    useCases: ["edge gateway", "industrial controller", "robot motor controller"],
    notes: "A capable option for networking-heavy Microchip designs with lots of firmware storage.",
  },
  {
    id: "stm32g474",
    name: "STM32G474RE",
    manufacturer: "STMicroelectronics",
    partNumber: "STM32G474RET6",
    category: "Motor Control MCU",
    architecture: "Arm Cortex-M4F",
    core: "Single-core 32-bit",
    clockMHz: 170,
    coreMark: 550,
    flashKB: 512,
    sramKB: 128,
    gpio: 52,
    adcBits: 12,
    operatingVoltage: "1.71V - 3.6V",
    package: "LQFP-64",
    power: { activeMa: 42, sleepUa: 1 },
    connectivity: ["USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["high-res timer", "op-amp", "comparator", "DAC", "motor-control PWM"],
    strengths: ["Motor control", "digital power", "fast analog"],
    useCases: ["robot motor controller", "power converter", "industrial controller"],
    notes: "Purpose-built for motor and power electronics where timers and analog blocks do real work.",
  },
  {
    id: "ra4m1",
    name: "RA4M1",
    manufacturer: "Renesas",
    partNumber: "R7FA4M1AB3CFM",
    category: "General Purpose MCU",
    architecture: "Arm Cortex-M4",
    core: "Single-core 32-bit",
    clockMHz: 48,
    coreMark: 165,
    flashKB: 256,
    sramKB: 32,
    gpio: 55,
    adcBits: 14,
    operatingVoltage: "1.6V - 5.5V",
    package: "LQFP-64",
    power: { activeMa: 10, sleepUa: 1.6 },
    connectivity: ["USB", "CAN", "I2C", "SPI", "UART"],
    peripherals: ["capacitive touch", "crypto", "DAC", "PWM"],
    strengths: ["5V support", "Arduino UNO R4 lineage", "balanced peripherals"],
    useCases: ["student dev board", "robot motor controller", "industrial controller"],
    notes: "A modern 5V-friendly Cortex-M option for learning, control, and mixed-voltage designs.",
  },
  {
    id: "efr32bg22",
    name: "EFR32BG22",
    manufacturer: "Silicon Labs",
    partNumber: "EFR32BG22C224F512GM32",
    category: "Wireless MCU",
    architecture: "Arm Cortex-M33",
    core: "Single-core 32-bit",
    clockMHz: 76.8,
    coreMark: 245,
    flashKB: 512,
    sramKB: 32,
    gpio: 26,
    adcBits: 12,
    operatingVoltage: "1.71V - 3.8V",
    package: "QFN-32",
    power: { activeMa: 8.2, sleepUa: 0.3 },
    connectivity: ["Bluetooth LE", "I2C", "SPI", "UART"],
    peripherals: ["secure vault", "crypto", "PRS", "low-energy timers"],
    strengths: ["Tiny BLE nodes", "low sleep current", "secure wireless"],
    useCases: ["BLE wearable", "IoT sensor node", "asset tracker"],
    notes: "A compact BLE MCU for very small products that need low current and secure wireless features.",
  },
];

export const CHIP_PRICE_SNAPSHOTS: ChipPriceSnapshot[] = [
  { partNumber: "ESP32-S3-WROOM-1-N8R8", distributor: "DigiKey", unitPriceUsd: 3.95, stock: 42150, leadTimeWeeks: 2, packaging: "Cut tape", source: "catalog snapshot" },
  { partNumber: "RP2040", distributor: "Mouser", unitPriceUsd: 0.7, stock: 185000, leadTimeWeeks: 1, packaging: "Reel", source: "catalog snapshot" },
  { partNumber: "STM32H743ZIT6", distributor: "DigiKey", unitPriceUsd: 13.4, stock: 9500, leadTimeWeeks: 4, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "STM32L476RGT6", distributor: "Arrow", unitPriceUsd: 5.35, stock: 28400, leadTimeWeeks: 3, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "NRF52840-QIAA-R", distributor: "Mouser", unitPriceUsd: 4.65, stock: 33200, leadTimeWeeks: 2, packaging: "Reel", source: "catalog snapshot" },
  { partNumber: "ATSAMD21G18A-AUT", distributor: "DigiKey", unitPriceUsd: 2.85, stock: 17800, leadTimeWeeks: 5, packaging: "Cut tape", source: "catalog snapshot" },
  { partNumber: "ATMEGA328P-AU", distributor: "Mouser", unitPriceUsd: 2.15, stock: 66700, leadTimeWeeks: 2, packaging: "Cut tape", source: "catalog snapshot" },
  { partNumber: "MIMXRT1062DVL6B", distributor: "Arrow", unitPriceUsd: 7.9, stock: 12800, leadTimeWeeks: 4, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "MSP430FR5994IPN", distributor: "DigiKey", unitPriceUsd: 8.25, stock: 5700, leadTimeWeeks: 6, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "LPC55S69JBD100", distributor: "Mouser", unitPriceUsd: 6.7, stock: 11900, leadTimeWeeks: 3, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "PIC32MZ2048EFH064-I/PT", distributor: "Microchip Direct", unitPriceUsd: 8.95, stock: 8100, leadTimeWeeks: 5, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "STM32G474RET6", distributor: "DigiKey", unitPriceUsd: 4.25, stock: 24400, leadTimeWeeks: 3, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "R7FA4M1AB3CFM", distributor: "Mouser", unitPriceUsd: 3.35, stock: 15600, leadTimeWeeks: 4, packaging: "Tray", source: "catalog snapshot" },
  { partNumber: "EFR32BG22C224F512GM32", distributor: "DigiKey", unitPriceUsd: 2.95, stock: 36100, leadTimeWeeks: 2, packaging: "Cut tape", source: "catalog snapshot" },
];
