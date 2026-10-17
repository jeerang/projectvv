# Worksheet — ระบบเลือกตั้ง (ระบบอ้างอิง)

Boundary: **U** = Unit · **I** = Integration · **C** = Component · **K** = Contract · **E** = End-to-end · **X** = ไม่ใช่ automated functional test

| # | Test case | Boundary | เหตุผล |
|---|---|---|---|
| 1 | เลขบัตรประชาชนที่ checksum ผิด ถูกปฏิเสธตอนลงทะเบียน | **U** | pure function (`isValidThaiNationalId`) ไม่มี I/O — ครอบคลุมทุก edge case ได้ถูกและเร็ว |
| 2 | ลงทะเบียนด้วยเขตเลือกตั้งที่ไม่มีในระบบ ได้ 400 | **U** (+ C 1 ข้อ) | กฎอยู่ใน `AccountService` → unit ด้วย stub `DistrictRepository`. component 1 ข้อพอเพื่อยืนยันว่า `ValidationError` แปลงเป็น HTTP 400 |
| 3 | `PgUserRepository.findByNationalId` คืน user ที่ map column → field ถูกต้อง | **I** | สิ่งที่อาจผิดคือ SQL และ mapping กับ schema จริง — mock database ไม่ช่วยเลย ต้องใช้ Postgres จริง |
| 4 | ผู้มีสิทธิเลือกตั้ง (VOTER) เรียก `POST /parties` แล้วได้ 403 | **C** | เป็นเรื่อง middleware + route wiring ต้องผ่าน HTTP จริง (supertest) แต่ไม่ต้องทั้งระบบ |
| 5 | ผู้ใช้ลงทะเบียน → login → ลงคะแนน → เปลี่ยนคะแนน → กกต. ปิดหีบ → ผลแสดงคะแนนถูกต้อง | **E** | คุณค่าอยู่ที่ "ทุกชิ้นทำงานร่วมกันได้จริง" — มีไม่กี่ข้อแบบนี้ก็พอ (acceptance test) |
| 6 | รหัสผ่านถูกเก็บแบบ hash ไม่ใช่ plain text | **U** | spy `UserRepository.create` แล้วตรวจว่า `passwordHash` ≠ รหัสผ่าน และ `verifyPassword` ผ่าน |
| 7 | หมายเลขผู้สมัครในเขตเดียวกันห้ามซ้ำ | **U** (+ I) | กฎใน `ElectionAdminService` → unit ด้วย fake repository. constraint `UNIQUE (district_id, number)` ใน DB เป็นด่านสุดท้ายกัน race condition → integration ถ้าต้องการยืนยัน |
| 8 | Liquibase changelog ทั้งหมด apply บน database เปล่าได้สำเร็จ | **I** (pipeline) | ไม่ต้องเขียน test แยก — `npm run test:integration` ทำทุกครั้งอยู่แล้ว และ CI สร้าง DB ใหม่ทุก run |
| 9 | ก่อนปิดหีบ `GET /districts/:id/results` ไม่แสดงคะแนน | **U** (+ C) | กฎการซ่อน/แสดงคะแนน → unit. component 1 ข้อยืนยันรูปร่าง JSON ที่ออกจาก API |
| 10 | Frontend คาดว่า results API มี field `closed` และ `candidates[].votes` | **K** | consumer-driven contract (เช่น Pact): frontend เขียน expectation, backend verify ใน CI — จับ breaking change โดยไม่ต้องรัน e2e |
| 11 | JWT ที่หมดอายุแล้ว ใช้ยืนยันตัวตนไม่ได้ | **U** | `JwtTokenService` + fake timers (`jest.useFakeTimers`) — ไม่ต้องรอจริง 1 ชั่วโมง |
| 12 | admin เปลี่ยน role ผู้ใช้เป็น กกต. แล้วผู้ใช้นั้นสร้างพรรคได้ | **C** | 2 request ผ่าน HTTP + DB จริงใน process เดียว. ถ้าเป็น journey หลักของธุรกิจ อาจมี e2e ด้วย |
| 13 | ระบบรับการลงคะแนนพร้อมกัน 1,000 ครั้งในนาทีแรกหลังเปิดหีบได้ | **X** | performance/load test (k6, Gatling, JMeter) — non-functional ไม่อยู่ใน pyramid |
| 14 | ผู้มีสิทธิเห็นเฉพาะผู้สมัครในเขตของตัวเอง | **C** | ตอนนี้กฎอยู่ใน SQL ของ legacy route → ต้องทดสอบผ่าน HTTP + DB. ถ้า refactor แยก logic ออกมา (Lab 07) จะลงไปเป็น unit ได้ |
| 15 | หน้ารายละเอียดพรรคแสดงผลสวยงามบนมือถือ | **X** | manual / exploratory หรือ visual regression (Playwright screenshot) — "สวย" ตัดสินอัตโนมัติยาก |
| 16 | หลังปิดหีบแล้ว ผู้มีสิทธิเปลี่ยนคะแนนไม่ได้ | **C** (→ U) | ตอนนี้ต้อง characterization ผ่าน component เพราะ legacy handler; หลัง sprout logic ออกมา (Lab 07) กฎจะทดสอบที่ unit ได้ |

