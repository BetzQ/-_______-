const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const USERS_DB = [
  { username: 'AAA', password: '04AAA10', role: 'teknisi', name: 'AAA', bqLink: 'https://docs.google.com/spreadsheets/d/1cQjqA9e_ROK_DL6lhwLlY--XdPO9xNC43VbfdVxxWsE/edit?usp=drive_link' },
  { username: 'ANO', password: '0808ANO', role: 'teknisi', name: 'ANO', bqLink: 'https://docs.google.com/spreadsheets/d/1z0nfI7RRQosYkqwM9LryCqReZEv89IqX7saa3TwWdVc/edit?usp=sharing' },
  { username: 'BDU', password: 'BDU2711', role: 'teknisi', name: 'BDU', bqLink: 'https://docs.google.com/spreadsheets/d/1pWfC8L9aOX-jH40t_eDbTYyag0jSXu2kttrNRmUoGyg/edit?usp=sharing' },
  { username: 'MOB', password: '08MOB10', role: 'teknisi', name: 'MOB', bqLink: 'https://docs.google.com/spreadsheets/d/1OeurbDSDkvtHP1YfNsN7uf9Bh_zQ0fKnU6JJvS-fUmk/edit?usp=sharing' },
  { username: 'MRN', password: '0810MRN', role: 'teknisi', name: 'MRN', bqLink: 'https://docs.google.com/spreadsheets/d/1o_G3OiybOBm1PhEKlTlMmcfRpd7w0N2lsKOv_Q-iB_c/edit?usp=sharing' },
  { username: 'NDS', password: 'NDS2711', role: 'teknisi', name: 'NDS', bqLink: 'https://docs.google.com/spreadsheets/d/1EHW0nnlfros-DP7FeVO8wdSGjz_E0M22VyvMVuQAb4Y/edit?usp=sharing' },
  { username: 'RIA', password: '14RIA05', role: 'teknisi', name: 'RIA', bqLink: 'https://docs.google.com/spreadsheets/d/1NvtqqkLL5FCQ2wJLsbulp8Yl05UgqaMnYHMx6xAbRuM/edit?usp=sharing' },
  { username: 'ROS', password: '2010ROS', role: 'teknisi', name: 'ROS', bqLink: 'https://docs.google.com/spreadsheets/d/1lLIK3NQUx_vn2Or3MY4mnuTooWiDsfTuxQZJcuiZ_PU/edit?usp=sharing' },
  { username: 'SFH', password: 'SFH0306', role: 'teknisi', name: 'SFH', bqLink: 'https://docs.google.com/spreadsheets/d/18DIWpGrQi5sH3iEsnKXxiVF3WHvl5gqUy2R8lI2oPnk/edit?usp=sharing' },
  { username: 'KFF', password: 'KFF0610', role: 'teknisi', name: 'KFF', bqLink: 'https://docs.google.com/spreadsheets/d/1R9Rwojmbt4YrHUeqVzIgXbY7DagAvEb1-RzGUjJpMV8/edit?usp=sharing' },
  { username: 'ERA', password: '19ERA01', role: 'teknisi', name: 'ERA', bqLink: 'https://docs.google.com/spreadsheets/d/1E4F_drOMHfl9nmGdjuVVKsBj4LihHj_ug7mzoCiv_yw/edit?usp=sharing' },
  { username: 'WAP', password: '0704WAP', role: 'teknisi', name: 'WAP', bqLink: 'https://docs.google.com/spreadsheets/d/1J4sZpKQpEWWldTKvmaqG1RUM6HH3juujFam5dK-MJ2I/edit?usp=sharing' },
  { username: 'MCL', password: 'MCL1702', role: 'teknisi', name: 'MCL', bqLink: 'https://docs.google.com/spreadsheets/d/1nCi_wyNHV1dHm6H1xxgptdUxG-Va9z6VEv44geRfT3s/edit?usp=sharing' },
  { username: 'INN', password: '30INN11', role: 'Supervisor 1', name: 'INN', bqLink: '' },
  { username: 'MUN', password: '2506MUN', role: 'Supervisor 2', name: 'MUN', bqLink: '' },
  { username: 'KAA', password: 'KAA1910', role: 'Supervisor 2', name: 'KAA', bqLink: '' },
  { username: 'ANS', password: 'ANS1805', role: 'Officer', name: 'ANS', bqLink: '' },
  { username: 'KSW', password: '01KSW10', role: 'manager', name: 'KSW', bqLink: '' }
];

const targetDir = path.join(__dirname, '..', 'Salinan_Spreadsheet_Sparepart');
const targetFile = path.join(targetDir, 'Master DB_User.xlsx');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const rows = [
  ['username', 'password', 'role', 'name', 'bqLink'],
  ...USERS_DB.map((u) => [u.username, u.password, u.role, u.name, u.bqLink]),
];

const worksheet = XLSX.utils.aoa_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
XLSX.writeFile(workbook, targetFile);

console.log(`Master DB berhasil dibuat di: ${targetFile}`);
console.log(`Total pengguna: ${USERS_DB.length}`);