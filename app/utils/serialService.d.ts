// Extend the Window interface to add type definitions for navigator.serial
interface Navigator {
  serial?: {
    requestPort(portInfo?): Promise<SerialPort>;
  };
}

interface SerialPortInfo {
  usbProductId: string;
  usbVendorId: string;
}
interface SerialPort {
  name: string;
  open(options?: SerialOptions): Promise<void>;
  close(): void;
  getInfo(): SerialPortInfo;
  readable: ReadableStream<Uint8Array>;
}

interface SerialOptions {
  baudRate?: number;
  bufferSize?: number;
}

export type { Navigator, SerialPort, SerialOptions };
