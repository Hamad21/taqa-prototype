// Generate branded Quality Team awareness PDFs by printing HTML via headless Edge (CDP).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9391;
const profileDir = path.join(process.env.TEMP || '.', 'edge-pdf-profile-' + PORT + '-' + process.pid);
const OUT = path.join(__dirname, 'documents', 'awareness');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------- content
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const docs = [
  {
    file: 'QT-PTS-QA-001_Common-Jointing-Defects.pdf',
    ref: 'QT-PTS-QA-001', date: '05 Jul 2026', rev: '1.2',
    title: 'Common Jointing Defects & How to Avoid Them',
    intro: 'The Quality Team sees the same joint defects repeat across sites — and almost all of them are avoidable with basic discipline. Use this card in toolbox talks: know the defect, know the cause, build the habit that prevents it.',
    table: {
      head: ['Defect', 'Typical cause', 'How to avoid it'],
      rows: [
        ['Moisture ingress', 'Jointing in damp conditions or over wet surfaces', 'Enclose the area, dry all surfaces and re-verify before closing the joint'],
        ['Surface contamination', 'Dust, oil or handling marks on insulation', 'Clean immediately before application; keep accessory packaging closed until use'],
        ['Poor conductor crimp', 'Wrong die or too few crimps', 'Use the correct die and crimp count; inspect every crimp'],
        ['Screen / semi-con damage', 'Careless cutting during preparation', 'Clean cuts only, no nicks; follow the preparation dimensions exactly'],
        ['Voids in insulation', 'Air trapped during insulation build-up', 'Apply per instruction and roll out trapped air layer by layer'],
        ['Earth / screen discontinuity', 'Bonding step missed', 'Verify metallic screen and earth continuity across the joint'],
        ['Wrong / mismatched kit', 'Components picked without checking', 'Confirm the kit against cable type, size and voltage class before starting'],
      ],
    },
    close: 'If a surface gets wet or dirty, or anything does not match the instruction — stop, correct it, and re-verify. When in doubt, call the Quality Team before closing the joint.',
  },
  {
    file: 'QT-PTS-QA-002_Workmanship-Standards.pdf',
    ref: 'QT-PTS-QA-002', date: '28 Jun 2026', rev: '1.0',
    title: 'Workmanship Standards for Cable Accessories',
    intro: 'What "good" looks like for LV and MV joints and terminations. These are the workmanship expectations the Quality Team checks against — build them into every job.',
    sections: [
      ['Cleanliness', ['Work in a clean, dry, enclosed environment.', 'Keep insulation and adhesive surfaces free of dust, oil and moisture.', 'Keep accessory packaging closed until the moment of use.']],
      ['Tooling', ['Use the correct crimp tool and die for the connector.', 'Use calibrated tools where calibration is required.', 'Cut and strip with controlled, sharp tools — no nicks.']],
      ['Preparation', ['Set out preparation dimensions per the manufacturer instruction.', 'Make clean screen breaks; no damage to the conductor.']],
      ['Insulation & stress control', ['Build up insulation void-free with correct overlaps.', 'Position stress-control components exactly as specified.']],
      ['Connectors', ['Correct connector size for the conductor.', 'Correct crimp count; check alignment and inter-phase spacing.']],
      ['Earthing & bonding', ['Maintain metallic screen continuity across the joint.', 'Bond and earth screens / armour as specified.']],
      ['Identification & records', ['Apply phase identification.', 'Record joint position and take photographs at key stages.']],
    ],
    close: 'Acceptance rule: any item marked "No" on the inspection checklist is a non-conformance and must be closed out before the activity is accepted.',
  },
  {
    file: 'QT-PTS-QA-003_Jointing-Weather-Field-Guide.pdf',
    ref: 'QT-PTS-QA-003', date: '12 Jul 2026', rev: '1.1',
    title: 'Jointing in Weather Conditions — Field Guide',
    intro: 'Heat, humidity, rain and dust all affect joint quality. The principle is simple: insulation surfaces must be clean, dry and at a controlled temperature at the moment the joint is closed. Use this go / no-go card on site — the manufacturer instruction and project specification always take precedence where stricter.',
    table: {
      head: ['Condition', 'Status', 'Control required'],
      status: 2,
      rows: [
        ['Dry, within material temperature window', 'PROCEED', 'Standard enclosure & cleanliness controls'],
        ['High humidity / condensation risk', 'CONTROL', 'Warm surfaces, dehumidify, re-check before closing'],
        ['High ambient heat', 'CONTROL', 'Shade materials, manage cure, schedule cooler hours'],
        ['Light airborne dust', 'CONTROL', 'Sealed enclosure, clean immediately before application'],
        ['Active rain on an open joint', 'STOP', 'Full enclosure & dry surfaces before proceeding'],
        ['Active sandstorm', 'STOP', 'Wait, clean down, verify before reopening'],
        ['Standing water in the excavation', 'STOP', 'De-water and provide a dry platform'],
      ],
    },
    controls: ['Erect and seal a jointing enclosure before opening any joint.', 'Keep surfaces clean and dry; warm or dehumidify where needed.', 'Record temperature and humidity on the pre-work checklist.', 'Stop and re-verify whenever the weather changes.'],
    close: 'When in doubt, stop and ask the Quality Team before opening a joint. Related: Adverse Weather Pre-Work Checklist (QT-PTS-CHK-003).',
  },
];

function statusTag(v) {
  const k = v.toUpperCase();
  const cls = k === 'PROCEED' ? 'ok' : (k === 'STOP' ? 'stop' : 'warn');
  return `<span class="st ${cls}">${esc(v)}</span>`;
}

function renderTable(t) {
  const head = `<tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>`;
  const rows = t.rows.map(r => `<tr>${r.map((c, i) =>
    `<td>${i === t.status ? statusTag(c) : esc(c)}</td>`).join('')}</tr>`).join('');
  return `<table class="tbl"><thead>${head}</thead><tbody>${rows}</tbody></table>`;
}

function renderSections(secs) {
  return secs.map(([h, items]) => `
    <div class="sec">
      <h3>${esc(h)}</h3>
      <ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
}

function html(d) {
  const body =
    (d.table ? renderTable(d.table) : '') +
    (d.sections ? `<div class="secs">${renderSections(d.sections)}</div>` : '') +
    (d.controls ? `<h3 class="ctl">Key controls</h3><ul class="ctl-list">${d.controls.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : '');
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@page { size: A4; margin: 16mm 15mm 20mm; }
* { box-sizing: border-box; }
body { font-family: Arial, "Roboto", sans-serif; color: #1a1a1d; margin: 0; font-size: 11.2px; line-height: 1.55; }
.mast { background: #00093f; color: #fff; border-radius: 8px; overflow: hidden; display: flex; }
.mast .l { padding: 16px 20px; flex: 1; }
.mast .r { background: #0ab3a1; width: 116px; display: flex; align-items: center; justify-content: center; text-align: center; }
.mast .r b { color: #fff; font-size: 13px; letter-spacing: .5px; }
.kicker { color: #9ad071; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.mast h1 { font-size: 19px; margin: 6px 0 2px; letter-spacing: .2px; }
.mast .sub { color: #c3c9e6; font-size: 10px; }
.meta { display: flex; gap: 0; margin: 12px 0 16px; border: 1px solid #dfe1ea; border-radius: 6px; overflow: hidden; }
.meta div { flex: 1; padding: 7px 12px; border-right: 1px solid #eceef4; }
.meta div:last-child { border-right: none; }
.meta .k { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #6a6c80; font-weight: 700; }
.meta .v { font-size: 11px; font-weight: 700; color: #00093f; }
.intro { color: #33343c; margin: 0 0 16px; }
.tbl { width: 100%; border-collapse: collapse; margin: 4px 0 14px; }
.tbl th { background: #00093f; color: #fff; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: .5px; padding: 9px 11px; }
.tbl td { border: 1px solid #dfe1ea; padding: 8px 11px; vertical-align: top; }
.tbl tbody tr:nth-child(even) td { background: #f7f8fb; }
.st { font-weight: 700; font-size: 9.5px; letter-spacing: .5px; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.st.ok { background: #e2f6f1; color: #08857a; } .st.warn { background: #fdf1dc; color: #b47407; } .st.stop { background: #fde5e5; color: #c0392b; }
.secs { columns: 2; column-gap: 22px; }
.sec { break-inside: avoid; margin-bottom: 12px; }
.sec h3 { color: #00093f; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; margin: 0 0 5px; border-left: 3px solid #0ab3a1; padding-left: 8px; }
.sec ul, .ctl-list { margin: 0; padding-left: 16px; }
.sec li, .ctl-list li { margin: 3px 0; }
.ctl-list li::marker, .sec li::marker { color: #0ab3a1; }
h3.ctl { color: #00093f; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; margin: 6px 0 6px; }
.close { margin-top: 16px; background: #f0fbf8; border: 1px solid #bfe9e0; border-radius: 6px; padding: 12px 14px; color: #076; font-size: 10.5px; }
.close b { color: #08857a; }
</style></head><body>
<div class="mast">
  <div class="l">
    <div class="kicker">Quality Awareness Corner · Power Technical Support</div>
    <h1>${esc(d.title)}</h1>
    <div class="sub">Quality Team — TAQA Distribution</div>
  </div>
  <div class="r"><b>TAQA<br>DISTRIBUTION</b></div>
</div>
<div class="meta">
  <div><div class="k">Reference No.</div><div class="v">${esc(d.ref)}</div></div>
  <div><div class="k">Revision</div><div class="v">${esc(d.rev)}</div></div>
  <div><div class="k">Last Updated</div><div class="v">${esc(d.date)}</div></div>
  <div><div class="k">Classification</div><div class="v">Internal</div></div>
</div>
<p class="intro">${esc(d.intro)}</p>
${body}
<div class="close"><b>Remember:</b> ${esc(d.close)}</div>
</body></html>`;
}

// ---------------------------------------------------------------- CDP driver
async function main() {
  const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
    `--user-data-dir=${profileDir}`, `--remote-debugging-port=${PORT}`, 'about:blank'], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 60; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; break; }
    catch { await sleep(300); }
  }
  if (!wsUrl) { proc.kill(); throw new Error('CDP never came up'); }
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const events = [];
  ws.onmessage = e => { const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
    else if (m.method) events.push(m); };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify(sessionId ? { id: i, method, params, sessionId } : { id: i, method, params })); });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);

  for (const d of docs) {
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html(d));
    events.length = 0;
    await send('Page.navigate', { url: dataUrl }, sessionId);
    for (let i = 0; i < 60; i++) { if (events.some(e => e.method === 'Page.loadEventFired')) break; await sleep(120); }
    await sleep(500);
    const footer = `<div style="font-size:7px;color:#8a8c9c;width:100%;padding:0 15mm;display:flex;justify-content:space-between;font-family:Arial;">
      <span>${d.ref} · Rev ${d.rev} · Last updated ${d.date} · Quality Team, Power Technical Support</span>
      <span>Controlled — verify current revision · Page <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`;
    const res = await send('Page.printToPDF', {
      printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer,
    }, sessionId);
    fs.writeFileSync(path.join(OUT, d.file), Buffer.from(res.data, 'base64'));
    console.log('saved', d.file, Math.round(Buffer.from(res.data, 'base64').length / 1024) + 'kb');
  }
  ws.close();
  try {
    const ps = `Get-CimInstance Win32_Process -Filter "Name = 'msedge.exe'" | Where-Object { $_.CommandLine -like '*${path.basename(profileDir)}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
    require('child_process').execSync(`powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
  } catch {}
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
}
main().catch(e => { console.error(e.message); process.exit(1); });
