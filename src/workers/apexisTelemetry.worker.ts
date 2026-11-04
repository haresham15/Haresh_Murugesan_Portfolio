/**
 * Apexis Telemetry Simulation Web Worker
 * Executes off-main-thread vehicle kinematics, throttle/brake interpolation,
 * and track sector progress without blocking the UI rendering thread.
 */

export interface CarTelemetry {
  id: number;
  driver: string;
  team: string;
  color: string;
  speed: number;       // km/h
  gear: number;        // 1 - 8
  throttle: number;    // 0.0 - 1.0
  brake: number;       // 0.0 - 1.0
  lapProgress: number; // 0.0 - 1.0
  delta: number;       // seconds relative to leader
  tireWear: number;    // percentage remaining (100 -> 0)
}

export interface WorkerInitMessage {
  type: 'INIT';
  carCount?: number;
}

export interface WorkerControlMessage {
  type: 'CONTROL';
  action: 'play' | 'pause' | 'reset';
  speedMultiplier?: number;
}

export type WorkerInMessage = WorkerInitMessage | WorkerControlMessage;

export interface WorkerTelemetryPayload {
  type: 'TELEMETRY_UPDATE';
  timestamp: number;
  cars: CarTelemetry[];
  workerFrame: number;
  computationTimeMs: number;
}

// Driver rosters for deterministic replay
const DRIVERS = [
  { driver: 'VER', team: 'Red Bull Racing', color: '#3671C6' },
  { driver: 'NOR', team: 'McLaren', color: '#FF8000' },
  { driver: 'LEC', team: 'Ferrari', color: '#E80020' },
  { driver: 'HAM', team: 'Mercedes-AMG', color: '#27F4D2' },
  { driver: 'PIA', team: 'McLaren', color: '#FF8000' },
];

let isRunning = false;
let speedMultiplier = 1;
let workerFrame = 0;
let intervalId: any = null;

// Track layout speed profile (simulating 16 sectors around circuit)
const SPEED_PROFILE = [
  { speed: 315, gear: 8, throttle: 1.0, brake: 0.0 }, // Main straight
  { speed: 110, gear: 3, throttle: 0.1, brake: 0.9 }, // T1 Heavy braking
  { speed: 145, gear: 4, throttle: 0.7, brake: 0.0 }, // T2 Apex exit
  { speed: 260, gear: 7, throttle: 1.0, brake: 0.0 }, // Sector 1 kink
  { speed: 190, gear: 5, throttle: 0.6, brake: 0.2 }, // T4 Chicane
  { speed: 220, gear: 6, throttle: 0.9, brake: 0.0 }, // Sweeper
  { speed: 290, gear: 8, throttle: 1.0, brake: 0.0 }, // Back straight
  { speed: 85,  gear: 2, throttle: 0.0, brake: 1.0 }, // Hairpin
  { speed: 130, gear: 4, throttle: 0.6, brake: 0.0 }, // Hairpin exit
  { speed: 240, gear: 7, throttle: 0.95, brake: 0.0 }, // Sector 3 entry
  { speed: 175, gear: 5, throttle: 0.5, brake: 0.3 }, // Complex S-curves
  { speed: 280, gear: 8, throttle: 1.0, brake: 0.0 }, // Final curve
];

const carsState: CarTelemetry[] = DRIVERS.map((d, index) => ({
  id: index + 1,
  driver: d.driver,
  team: d.team,
  color: d.color,
  speed: 280 - index * 10,
  gear: 7,
  throttle: 0.9,
  brake: 0.0,
  lapProgress: Math.max(0, 0.95 - index * 0.05),
  delta: index * 0.38,
  tireWear: 94.5 - index * 0.8,
}));

function tickSimulation() {
  if (!isRunning) return;
  const start = performance.now();
  workerFrame++;

  const progressIncrement = 0.003 * speedMultiplier;

  carsState.forEach((car, idx) => {
    car.lapProgress = (car.lapProgress + progressIncrement * (1 - idx * 0.015)) % 1.0;
    
    // Sample speed profile along circuit
    const sectorIndex = Math.floor(car.lapProgress * SPEED_PROFILE.length) % SPEED_PROFILE.length;
    const target = SPEED_PROFILE[sectorIndex];

    // Smoothly interpolate telemetry parameters
    car.speed = Math.round(car.speed + (target.speed - car.speed) * 0.15);
    car.gear = target.gear;
    car.throttle = Number((car.throttle + (target.throttle - car.throttle) * 0.2).toFixed(2));
    car.brake = Number((car.brake + (target.brake - car.brake) * 0.25).toFixed(2));
    car.tireWear = Math.max(10, Number((car.tireWear - 0.002 * speedMultiplier).toFixed(1)));
    
    // Leader delta
    car.delta = idx === 0 ? 0.0 : Number((car.delta + (Math.sin(workerFrame * 0.05 + idx) * 0.01)).toFixed(3));
  });

  const computationTimeMs = Number((performance.now() - start).toFixed(3));

  const payload: WorkerTelemetryPayload = {
    type: 'TELEMETRY_UPDATE',
    timestamp: Date.now(),
    cars: carsState,
    workerFrame,
    computationTimeMs,
  };

  self.postMessage(payload);
}

self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
  const msg = e.data;
  if (!msg) return;

  if (msg.type === 'INIT') {
    if (!intervalId) {
      intervalId = setInterval(tickSimulation, 1000 / 60); // 60hz loop
    }
    isRunning = true;
  } else if (msg.type === 'CONTROL') {
    if (msg.action === 'play') {
      isRunning = true;
    } else if (msg.action === 'pause') {
      isRunning = false;
    } else if (msg.action === 'reset') {
      carsState.forEach((car, index) => {
        car.lapProgress = Math.max(0, 0.95 - index * 0.05);
        car.speed = 280 - index * 10;
        car.tireWear = 95.0;
      });
      workerFrame = 0;
    }
    if (msg.speedMultiplier) {
      speedMultiplier = msg.speedMultiplier;
    }
  }
};

export {};
