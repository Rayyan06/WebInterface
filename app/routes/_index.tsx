import type { MetaFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import {
  connectSerialDevice,
  readFromSerial,
} from '~/utils/serialService.client';
import { SerialOptions, SerialPort } from '~/utils/serialService';

export const meta: MetaFunction = () => {
  return [
    { title: 'Encoder Interface' },
    { name: 'description', content: 'View encoder data coming in live' },
  ];
};

export default function Index() {
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);

  useEffect(() => {
    /* Make sure the port is closed on unmount */
    return () => {
      if (serialPort) {
        serialPort.close();
      }
    };
  }, [serialPort]); // dependency array means this only runs once on page load when the page mounts, and then when serialPort needs to close

  const handleConnectSerial = async () => {
    /* If no saved port, we connect to a new port and save the info */
    const port = await connectSerialDevice();
    if (port) {
      setSerialPort(port);
      readFromSerial(port);
    }
  };

  return (
    <div>
      <h1>Encoder</h1>
      {serialPort ? <p>Connected!</p> : <p>Not connected.</p>}
      <button onClick={handleConnectSerial}>
        {serialPort ? 'Disconnect' : 'Connect Serial'}
      </button>
      <div style={{ width: '80%', height: 500 }}>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
}
