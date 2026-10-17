# Readiness Checklist — Software Testing in Real Industry

ประเมินโปรเจกต์ระบบเลือกตั้ง **ของตัวเอง** 2 รอบ: Day 1 เช้า (ก่อนเริ่ม) และ Day 2 ท้ายวัน (หลังจบ)

คะแนน: **0** = ยังไม่มี · **1** = มีบางส่วน / ทำด้วยมือ · **2** = มีครบ และทำงานอัตโนมัติ

| # | หมวด | ข้อ | ตัวอย่างหลักฐาน ("2 คะแนน" หน้าตาเป็นอย่างไร) | รอบ 1 | รอบ 2 |
|---|---|---|---|:---:|:---:|
| 1 | Structure | ระบุ test boundary ของระบบชัดเจน | มีเอกสาร/README บอกว่า unit, component, e2e ทดสอบอะไร และอยู่ที่ไหน | 0 | 2 |
| 2 | Structure | แยก test ที่ไม่มี I/O ออกจาก test ที่ต้องใช้ database | `npm run test:unit` รันได้โดยไม่ต้องเปิด Docker | 0 | 2 |
| 3 | Structure | รัน test ทั้งหมดได้ด้วยคำสั่งเดียว | `npm test` จาก clone ใหม่ ไม่ต้องทำขั้นตอนมือ | 1 | 2 |
| 4 | Environment | database สำหรับ test สร้างจาก migration ที่ versioned | changelog/migration อยู่ใน git, test DB สร้างใหม่ได้ทุกครั้ง | 1 | 2 |
| 5 | Environment | ไม่มีขั้นตอน database ที่ต้องทำด้วยมือ | ไม่มี "import dump.sql ก่อนนะ" หรือ "สร้าง table นี้เอง" | 0 | 2 |
| 6 | Environment | test รันได้เหมือนกันทั้งในเครื่องและใน CI | CI เรียก script เดียวกับที่รันในเครื่อง และรันทุก push | 0 | 2 |
| 7 | Data | ข้อมูลใน test สร้างด้วย builder / factory ไม่ใช่ fixture ก้อนเดียวที่ทุก test ใช้ร่วมกัน | `aVoter().inDistrict('CM-1').build()` | 0 | 2 |
| 8 | Data | test แต่ละตัวไม่ขึ้นกับกันและกัน | รันตัวเดียว, สลับลำดับ, หรือรันซ้ำ ก็ได้ผลเหมือนเดิม | 1 | 2 |
| 9 | Data | ควบคุมเวลาและค่าสุ่มได้ | inject `Clock`, fake timers, `faker.seed()` | 0 | 2 |
| 10 | Design | dependency สำคัญ inject ได้ (มี seam) | DB, เวลา, token service ส่งเข้ามาผ่าน constructor/factory | 0 | 2 |
| 11 | Design | ใช้ test double ถูกระดับ | mock/stub เฉพาะ boundary ที่เราเป็นเจ้าของ interface, ไม่ mock ทุกอย่าง | 1 | 2 |
| 12 | Design | ส่วน legacy ที่เสี่ยงที่สุดมี characterization test | ก่อนแก้โค้ดเก่า มี test จับพฤติกรรมปัจจุบันไว้ | 0 | 2 |
| | | | **รวม (เต็ม 24)** | **4** | **24** |

## หลังให้คะแนน

### 1. ข้อที่เคยได้ 0 แต่แก้ได้ภายใน 1 วัน (Quick Wins):
- **ข้อ 1 & 2 (Structure & Fast Feedback):** แยก pure logic (เช่น `thaiNationalId`, `ballotRules`, `passwords`) ออกจาก Express handlers มาไว้ใน `src/domain/` แล้วเขียน unit test ด้วย `npm run test:unit` ไม่ต้องพึ่งพา Database หรือ Docker รันจบในเวลาไม่กี่วินาที
- **ข้อ 7 (Test Data Builders):** สร้าง Builder pattern เช่น `aVoter()`, `anElection()` ใน `test/support/builders.ts` ช่วยลด boilerplate ใน test code และทำให้ test ชัดเจนตามหลัก AAA
- **ข้อ 12 (Characterization Testing):** สำหรับ endpoint เดิมที่เสี่ยงและซับซ้อน เช่น การลงคะแนนเสียง ให้เขียน Characterization tests ดักจับพฤติกรรมปัจจุบัน (ทั้ง happy path, invalid token, duplicate vote) ก่อนเริ่มแตะต้องหรือ refactor โค้ดเดิม

### 2. ข้อที่ทีมใน Industry มักข้าม แล้วค่อยมาจ่ายหนี้ทางเทคนิค (Technical Debt) ก้อนโตทีหลัง:
- **ข้อ 4 & 5 (Database Migrations & Test Isolation):** หลายทีมละเลยการทำ automated migration โดยอาศัย `dump.sql` หรือ database ชั่วคราว เมื่อเวลาผ่านไป schema บน dev/staging/test ไม่ตรงกัน ทำให้เกิด flaky tests และไม่สามารถ automate CI ได้อย่างมั่นใจ
- **ข้อ 9 & 10 (Controlling Time/Randomness & Seams):** การเรียก `new Date()` หรือใช้ database connection แบบ singleton ตรงๆ ใน business logic ทำให้ระบบขาด *Seams* ที่จะควบคุมเวลาในเคสสำคัญ เช่น การปิดหีบเลือกตั้ง (Poll closing) หรือบัตรหมดอายุ การ refactor ให้ inject `Clock` และ dependency ผ่าน constructor/factory จึงเป็นรากฐานที่สำคัญที่สุดสำหรับ Testability
- **ข้อ 6 (CI Pipeline with Coverage Gates):** การมี test แต่ไม่ได้บังคับรันบน CI หรือไม่มี coverage gate ใน domain core มักทำให้ regression bugs หลุดรอดไปถึง production เมื่อมีคน merge โค้ดที่ไม่มี test เข้ามา

### 3. Action Plan สำหรับนำไปใช้ต่อในโปรเจกต์ของตัวเอง:
1. นำโครงสร้าง Harness จาก `labs/08-own-project/templates/` ไปใส่ใน branch `testing-workshop`:
   - แยก `app.ts` (export Express instance สำหรับ supertest) ออกจาก `server.ts` (listen port) เพื่อสร้าง Seam แรก
   - นำ `jest.config.js` ที่แยก project `unit` และ `integration` ไปใช้
   - ตั้งค่า `docker-compose.test.yml` สำหรับรัน test database อัตโนมัติ
2. สกัด business logic ในระบบเลือกตั้ง (เช่น กฎการนับคะแนน, การตรวจสอบสิทธิ) ให้เป็น pure functions และมี Unit test คลุม 100%
3. ติดตั้ง GitHub Actions CI (`.github/workflows/ci.yml`) ตรวจสอบ coverage gate ทุก pull request

