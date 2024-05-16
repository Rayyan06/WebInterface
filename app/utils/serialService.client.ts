import { Navigator, SerialPort, SerialOptions } from './serialService';
import myChart, { updateChart } from './dataChart.client';

async function connectSerialDevice(): Promise<SerialPort | null> {
  try {
    // Navigator must exist and have the serial property
    if ('serial' in navigator && navigator.serial) {
      /* requestPort() must be initiated by a user gesture */
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        /* Port info is not provided and we have to request a port connection from the user */
        const port = await (navigator as Navigator).serial!.requestPort();
        return port || null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error connecting to serial device: ', error);
    const retryConnection = window.confirm(
      "You didn't select any serial port, try connecting again?"
    );
    if (retryConnection == true) return connectSerialDevice();
    return null;
  }
}

async function readFromSerial(port: SerialPort) {
  await port.open({ baudRate: 9600 });

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  let buffer = '';
  let angleBuffer = '';
  let timeBuffer = '';
  let isAngle = true;

  let dataPoints = []; // Store the final datapoints

  // Listen to data coming from the serial device.
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later
        reader.releaseLock();
        break;
      }
      if (value) {
        // split by '\r\n' to extract angle values
        buffer += value;

        // Split buffer by '\n' to extract angle values
        if (buffer.endsWith('\n')) {
          // Split buffer by '\r' (carriage return) to extract angle and time values
          const data = buffer.trim().split('\r');

          data.forEach((item) => {
            if (isAngle) {
              angleBuffer += item;
            } else {
              timeBuffer += item;
            }
            isAngle = !isAngle;
          });
          // Process angle and time values
          const angle = parseInt(angleBuffer, 10);
          const time = parseInt(timeBuffer, 10) / 250;

          dataPoints.push({ angle, time });

          updateChart({ angle, time });

          // Clear buffers
          buffer = '';
          angleBuffer = '';
          timeBuffer = '';
        }
      }
    }
  } catch (error) {
    // Handle error
    console.error('Error reading from serial port:', error);
  } finally {
    // Ensure the serial port is closed when done
    readableStreamClosed.then(() => port.close());
  }
}

export { connectSerialDevice, readFromSerial };
