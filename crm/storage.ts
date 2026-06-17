
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/leads.json');

function read() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function write(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const LeadStore = {
  all() { return read(); },
  insert(lead: any) {
    const data = read();
    data.push(lead);
    write(data);
  },
  update(id: string, patch: any) {
    const data = read();
    const idx = data.findIndex((x: any) => x.id === id);
    if (idx >= 0) {
      data[idx] = { ...data[idx], ...patch };
      write(data);
    }
  }
};
