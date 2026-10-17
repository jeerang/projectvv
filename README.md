# Software Testing in Real Industry — Workshop & Own Project
> **Hands-on Automated Testing Workshop, CI Pipelines & Readiness Checklist**  
> หลักสูตรวิชา SE725 / CMU CAMT · ระบบเลือกตั้งจำลอง (Election System)  
> **Repository:** [https://github.com/jeerang/projectvv](https://github.com/jeerang/projectvv)  
> **Author:** light (jeerang_wo@cmu.ac.th)

---

## 📑 สารบัญ (Table of Contents)
1. [คู่มือการติดตั้งและสั่งรันชุดทดสอบ (Step-by-Step Setup & Execution Instructions)](#1-คู่มือการติดตั้งและสั่งรันชุดทดสอบ-step-by-step-setup--execution-instructions)
   - [ความต้องการของระบบ (Prerequisites)](#11-ความต้องการของระบบ-prerequisites)
   - [ขั้นตอนการติดตั้ง (Setup Instructions)](#12-ขั้นตอนการติดตั้ง-setup-instructions)
   - [การรัน Unit Test Suite (Zero I/O, ไม่ต้องใช้ Docker)](#13-การรัน-unit-test-suite-zero-io-ไม่ต้องใช้-docker)
   - [การรัน Unit Test พร้อม Coverage Gate](#14-การรัน-unit-test-พร้อม-coverage-gate)
   - [การรัน Integration & E2E Tests (ต้องเปิด Docker)](#15-การรัน-integration--e2e-tests-ต้องเปิด-docker)
   - [การรัน Test บนโปรเจกต์ของตัวเอง (Own Project / testing-workshop)](#16-การรัน-test-บนโปรเจกต์ของตัวเอง-own-project--testing-workshop)
2. [ทฤษฎีการทดสอบซอฟต์แวร์ที่นำมาประยุกต์ใช้ (Testing Theoretical Concepts Applied)](#2-ทฤษฎีการทดสอบซอฟต์แวร์ที่นำมาประยุกต์ใช้-testing-theoretical-concepts-applied)
   - [2.1 Test Boundaries & Testing Pyramid (Toby Clemson / Martin Fowler)](#21-test-boundaries--testing-pyramid-toby-clemson--martin-fowler)
   - [2.2 AAA Pattern & Test Smells Refactoring (Gerard Meszaros)](#22-aaa-pattern--test-smells-refactoring-gerard-meszaros)
   - [2.3 Test Doubles Hierarchy ครบทั้ง 5 รูปแบบ (Meszaros / Fowler)](#23-test-doubles-hierarchy-ครบทั้ง-5-รูปแบบ-meszaros--fowler)
   - [2.4 Test Data Management: Builders & Determinism (xUnit Patterns)](#24-test-data-management-builders--determinism-xunit-patterns)
   - [2.5 Outside-In TDD / Double-Loop TDD (Freeman & Pryce - GOOS)](#25-outside-in-tdd--double-loop-tdd-freeman--pryce---goos)
   - [2.6 Working Effectively with Legacy Code: Seams, Sprout & Characterization (Michael Feathers)](#26-working-effectively-with-legacy-code-seams-sprout--characterization-michael-feathers)
   - [2.7 Continuous Integration & Quality Gates (Martin Fowler / Jez Humble)](#27-continuous-integration--quality-gates-martin-fowler--jez-humble)
3. [ตารางสรุปผลงาน Labs 00 – 08 (Summary of Workshop Labs)](#3-ตารางสรุปผลงาน-labs-00--08-summary-of-workshop-labs)
4. [ผลการประเมินตนเอง (Readiness Checklist Evaluation)](#4-ผลการประเมินตนเอง-readiness-checklist-evaluation)
5. [การนำไปประยุกต์ใช้กับโปรเจกต์จริง (Own Project Integration)](#5-การนำไปประยุกต์ใช้กับโปรเจกต์จริง-own-project-integration)
6. [เอกสารอ้างอิงทางวิชาการ (References)](#6-เอกสารอ้างอิงทางวิชาการ-references)

---

## 1. คู่มือการติดตั้งและสั่งรันชุดทดสอบ (Step-by-Step Setup & Execution Instructions)

เอกสารส่วนนี้จัดทำขึ้นเพื่อให้ผู้ประเมิน (Evaluator / TA / อาจารย์) สามารถ Setup สภาพแวดล้อมและสั่งรันชุดทดสอบ (โดยเฉพาะ **Unit Test Suite**) ได้อย่างราบรื่น ไม่มีสะดุด (Seamless Execution)

### 1.1 ความต้องการของระบบ (Prerequisites)
- **Node.js**: เวอร์ชัน `>= 20.x` หรือ `>= 22.x` (ทดสอบผ่านบน Node `v24.13.1` / npm `11.8.0`)
- **Git**: สำหรับสลับ branch และดึงโค้ด
- **Docker Desktop**: *(จำเป็นเฉพาะเมื่อต้องการรัน Integration Test / E2E Test)* ส่วน **Unit Test สามารถรันได้ทันทีโดยไม่ต้องเปิด Docker**

---

### 1.2 ขั้นตอนการติดตั้ง (Setup Instructions)

เปิด Terminal แล้วดำเนินการตามขั้นตอนดังนี้:

```bash
# 1. Clone repository
git clone https://github.com/jeerang/projectvv.git
cd projectvv

# 2. เข้าไปยังโฟลเดอร์แอปพลิเคชัน
cd app

# 3. ติดตั้ง Dependencies ทั้งหมดอย่างเคร่งครัดตาม lockfile
npm ci

# 4. (ทางเลือก) ตรวจสอบความพร้อมของระบบ
npm run doctor
```
> เมื่อรัน `npm run doctor` ระบบจะตรวจสอบ 9 รายการ (Node, Docker, Ports, Git) และแสดงผล `9/9 checks passed  READY`

---

### 1.3 การรัน Unit Test Suite (Zero I/O, ไม่ต้องใช้ Docker)

Unit Test Suite ในโปรเจกต์นี้ถูกออกแบบตามหลัก **Zero I/O (ไม่มีการเชื่อมต่อฐานข้อมูล เครือข่าย หรือไฟล์ภายนอก)** ทำให้สามารถรันได้อย่างรวดเร็วมาก (~8-9 วินาที)

รันคำสั่งในโฟลเดอร์ `app/`:

```bash
npm run test:unit
```

**ผลลัพธ์ที่คาดหวัง:**
```text
Running one project: unit
PASS unit test/unit/toPublicUser.test.ts
PASS unit test/unit/ballotRules.test.ts
PASS unit test/unit/passwords.test.ts
PASS unit test/unit/electionAdminService.test.ts
PASS unit test/unit/thaiNationalId.test.ts
PASS unit test/unit/config.test.ts
PASS unit test/unit/accountService.test.ts
PASS unit test/unit/pollService.test.ts
PASS unit test/unit/jwtTokenService.test.ts

Test Suites: 9 passed, 9 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        ~8-9 s
```

---

### 1.4 การรัน Unit Test พร้อม Coverage Gate

เพื่อตรวจสอบความครอบคลุมของการทดสอบตามเกณฑ์คุณภาพ (Quality Gate) ที่กำหนดไว้:
- `src/domain/` ต้องครอบคลุม **100% Branches/Functions/Lines/Statements**
- `src/services/` ต้องครอบคลุม **>= 75%**

รันคำสั่ง:
```bash
npm run test:coverage
```

---

### 1.5 การรัน Integration & E2E Tests (ต้องเปิด Docker)

หากต้องการทดสอบการทำงานร่วมกับ PostgreSQL จริง (รันบน port `5433` เพื่อไม่ให้ชนกับ port `5432` ทั่วไป พร้อม tmpfs memory):

```bash
# 1. ตรวจสอบว่า Docker Desktop เปิดทำงานอยู่
# 2. รัน Integration Tests (ระบบจะสตาร์ต db-test container + Liquibase migrate อัตโนมัติ)
npm run test:integration

# 3. รัน Playwright End-to-End Tests (Black-box container)
npm run test:e2e

# 4. หรือรันคำสั่งเดียวครอบคลุมทั้ง Unit + Integration
npm test
```

---

### 1.6 การรัน Test บนโปรเจกต์ของตัวเอง (Own Project / testing-workshop)

สำหรับโค้ดโปรเจกต์ Backend ระบบเลือกตั้งจริงที่นำ Test Harness ไปติดตั้ง:

```bash
# สลับไปยัง branch testing-workshop
git switch testing-workshop

# เข้าสู่โฟลเดอร์โปรเจกต์
cd own-project

# ติดตั้ง dependencies
npm ci

# รัน Unit Tests ของ own-project (ทดสอบ role authorization middleware ด้วย AAA)
npm run test:unit

# รัน Integration Test ของ own-project (ทดสอบ Express API ผ่าน Supertest)
npx jest --selectProjects integration
```

---

## 2. ทฤษฎีการทดสอบซอฟต์แวร์ที่นำมาประยุกต์ใช้ (Testing Theoretical Concepts Applied)

ในการพัฒนา Automated Testing ของระบบนี้ มีการนำทฤษฎีและระเบียบวิธีวิจัยมาตรฐานสากลมาประยุกต์ใช้อย่างเคร่งครัด ดังนี้:

### 2.1 Test Boundaries & Testing Pyramid (Toby Clemson / Martin Fowler)
- **แนวคิด:** อิงตามงานวิจัย *Testing Strategies in a Microservice Architecture* ของ Toby Clemson บน martinfowler.com แบ่งสัดส่วนการทดสอบเป็นพีระมิด:
  1. **Unit Tests (ฐานพีระมิด - สัดส่วนมากที่สุด):** ทดสอบ Class/Function ใน `src/domain/` แบบแยกเดี่ยว (Solitary) ปราศจาก I/O รันเร็วและให้ผลลัพธ์แบบ Deterministic
  2. **Component / Integration Tests (ชั้นกลาง):** ทดสอบการประกอบชิ้นส่วน Service + Repository + PostgreSQL จริง เพื่อยืนยันว่า SQL queries และ Transaction ทำงานถูกต้อง
  3. **E2E Tests (ยอดพีระมิด - สัดส่วนน้อยที่สุด):** ทดสอบเส้นทางวิกฤตของ User Journey จากภายนอกผ่าน HTTP APIs เสมือนใช้งานจริงในระบบ Production
- **การแยก Boundary ใน Jest:** ใช้ฟีเจอร์ Jest Multi-Project Runner ใน `jest.config.js` แยกโปรเจกต์ `unit` (ไม่โหลด environment DB) ออกจาก `integration` (โหลด `env.ts` และรัน `--runInBand` เพื่อป้องกัน race condition ใน DB)

```text
                 /\
                /  \      E2E Tests (Playwright, Black-box container)
               /----\
              /      \    Integration Tests (Supertest + PostgreSQL on tmpfs)
             /--------\
            /          \  Unit Tests (Pure TS, 0 I/O, Fast feedback)
           --------------
```

---

### 2.2 AAA Pattern & Test Smells Refactoring (Gerard Meszaros)
- **แนวคิด:** จากตำราคลาสสิก *xUnit Test Patterns: Refactoring Test Code* ของ Gerard Meszaros
- **AAA Pattern (Arrange-Act-Assert):**
  - **Arrange:** จัดเตรียมข้อมูลตั้งต้น ตัวแปร และ Dependencies ที่จำเป็น
  - **Act:** เรียกใช้งาน Method หรือ Function ภายใต้การทดสอบเพียงคำสั่งเดียว
  - **Assert:** ตรวจสอบผลลัพธ์ (State หรือ Behavior) ให้ชัดเจน
- **การขจัด Test Smells (Anti-patterns ที่แก้ไข):**
  - *Obscure Test (เทสต์ที่อ่านยาก/คลุมเครือ):* แยกก้อนเทสต์รวมขนาดใหญ่ใน `lab02-smelly.test.ts` ออกเป็นไฟล์ย่อยตาม Domain SUT (System Under Test) ได้แก่ `thaiNationalId.test.ts`, `passwords.test.ts`, `config.test.ts`, `toPublicUser.test.ts`
  - *Assertion Roulette (ใส่ assertion ซ้อนกันหลายข้อโดยไม่รู้ว่าข้อไหนพัง):* แยก 1 พฤติกรรมต่อ 1 `it(...)` บล็อก
  - *General Fixture Smell:* เลิกใช้ข้อมูลตัวอย่างมหาศาลร่วมกัน หันมาสร้าง fixture เฉพาะเท่าที่เทสต์แต่ละข้อต้องการ

---

### 2.3 Test Doubles Hierarchy ครบทั้ง 5 รูปแบบ (Meszaros / Fowler)
- **แนวคิด:** อิงตามบทความ *Mocks Aren't Stubs* ของ Martin Fowler และจำแนกตาม Meszaros โดยไม่ใช้คำว่า Mock ปนเปกับ Stub:
  1. **Dummy:** อ็อบเจกต์ส่งผ่านเพื่อให้ครบ Signature ของฟังก์ชัน เช่น ส่ง `DummyAccountRepo` เข้าไปใน Service ที่ไม่ได้เรียกใช้
  2. **Stub:** อ็อบเจกต์ที่เตรียมคำตอบไว้ล่วงหน้า (Canned Answers) เพื่อให้ SUT ทำงานต่อไปได้ตามเส้นทางที่ต้องการ เช่น Stub คืนค่า `findById` เสมอ
  3. **Spy:** อ็อบเจกต์ที่ดักบันทึกข้อมูลและประวัติการเรียกใช้งาน (Invocation records) เพื่อนำมา Assert ในภายหลัง เช่น `jest.spyOn()` หรือนับจำนวนครั้งที่ method ถูกเรียก
  4. **Mock:** อ็อบเจกต์ที่มีการตั้งความคาดหวังล่วงหน้า (Pre-programmed expectations) ว่าจะต้องถูกเรียกด้วยพารามิเตอร์ใด และจะ fail ทันทีถ้าการเรียกไม่เป็นไปตามข้อกำหนด (Behavior Verification)
  5. **Fake:** อ็อบเจกต์ที่มี Business Implementation จริงที่ทำงานได้สมบูรณ์ แต่ใช้กลไกที่เรียบง่ายและไม่เหมาะกับ Production เช่น `InMemoryAccountRepository`, `InMemoryElectionRepository` ที่เก็บข้อมูลลงใน JavaScript `Map`
- **Fake Timers (LMAX Clock Pattern):** แทนที่จะรอเวลาจริงด้วย `sleep()` ซึ่งทำให้เทสต์ช้าและ Flaky เราใช้ `jest.useFakeTimers()` และ `jest.setSystemTime()` ร่วมกับการ inject `Clock` interface เพื่อทดสอบเหตุการณ์ Token หมดอายุหรือเวลาปิดหีบได้ทันทีในหน่วยมิลลิวินาที

---

### 2.4 Test Data Management: Builders & Determinism (xUnit Patterns)
- **Test Data Builder Pattern:** นำ GoF Builder Pattern มาสร้าง Object สำหรับเทสต์ เช่น `aVoter().inDistrict('CM-1').build()` มีค่า default ที่สมบูรณ์ตาม Schema ทำให้โค้ดเทสต์กระชับ ระบุเฉพาะ field ที่สำคัญต่อเคสทดสอบนั้นๆ
- **Deterministic Pseudo-Random Generation (`seedFaker`):** ใน integration test มีการใช้ `@faker-js/faker` สร้างข้อมูลจำลอง แต่ทำการ Seed ด้วยชื่อ Test Case เสมอ ทำให้สุ่มได้ข้อมูลเสมือนจริงแต่ได้ผลลัพธ์เดิมทุกครั้ง 100% ไม่เกิดปัญหา Random Test Failures
- **Database Isolation via Truncate:** ใช้คำสั่ง `TRUNCATE ... RESTART IDENTITY CASCADE` ล้างข้อมูลทุก Table ก่อนเริ่มแต่ละ Test Case ทำให้แต่ละ Test ไม่ส่งผลกระทบต่อกัน สามารถรันสลับลำดับได้ผลคงที่

---

### 2.5 Outside-In TDD / Double-Loop TDD (Freeman & Pryce - GOOS)
- **แนวคิด:** อิงตามตำรา *Growing Object-Oriented Software, Guided by Tests (GOOS)*
- **Outer Loop (Acceptance Loop):**
  - เริ่มต้นด้วยการเขียน Playwright Acceptance E2E Test (`close-poll.spec.ts`) ซึ่งยังรันไม่ผ่าน (Red) เพื่อกำหนดเป้าหมายเชิงธุรกิจของผู้ใช้งาน (User-facing feature)
- **Inner Loop (TDD Unit/Component Loop):**
  - ขับเคลื่อนการสร้าง Database Migration ผ่าน Liquibase (`005-district-poll-closing.sql`)
  - สร้าง Repository Interface และ Implement ลงใน `districtRepository.ts` พร้อม Integration Test
  - สร้าง `PollService.ts` พร้อม Unit Test ควบคุมตรรกะการคำนวณและสถานะ
  - เชื่อมโยงเข้ากับ Express Route `electionRoutes.ts`
  - วนลูป TDD จนกระทั่ง Outer Loop (Acceptance Test) เปลี่ยนเป็นสีเขียว (Green)

---

### 2.6 Working Effectively with Legacy Code: Seams, Sprout & Characterization (Michael Feathers)
- **แนวคิด:** อิงตามหลักการของ Michael Feathers ในหนังสือ *Working Effectively with Legacy Code*
- **Characterization Tests (Golden Master Tests):** เขียนเทสต์ดักจับและบันทึกพฤติกรรมปัจจุบันของระบบ (แม้กระทั่งพฤติกรรมแปลกๆ) ใน `vote.characterization.test.ts` เพื่อสร้างตาข่ายความปลอดภัย (Safety Net) ก่อนแตะต้องหรือ Refactor โค้ดเก่า
- **Finding & Creating Seams (รอยต่อสำหรับแทรก Test Double):**
  - ใช้เทคนิค **Parameterize Constructor / Factory Function** แก้ไข `voteRoutes.ts` จากเดิมที่ผูกติดกับ Global Database Pool และ Token Service โดยตรง ให้รับ `pool`, `tokens`, และ `clock` ผ่านพารามิเตอร์ ทำให้สามารถ Inject Test Doubles เข้าไปได้
- **Sprout Method / Sprout Class:** เมื่อต้องเพิ่มฟังก์ชันตรวจสอบความถูกต้องของบัตรลงคะแนน แทนที่จะแทรก `if-else` รกเข้าไปใน legacy route เราสร้างโมดูลใหม่ `ballotRules.ts` เป็น Pure Domain Logic เขียน Unit Test ควบคุม 100% แล้วจึงเรียกใช้งานจาก Route เดิม

---

### 2.7 Continuous Integration & Quality Gates (Martin Fowler / Jez Humble)
- **แนวคิด:** การรวมโค้ดและทดสอบอัตโนมัติบน CI Server ทุกครั้งที่มีการ Push โค้ด
- **Multi-CI Parity:** รองรับ 3 แพลตฟอร์มหลักในอุตสาหกรรม ได้แก่ GitHub Actions (`.github/workflows/ci.yml`), GitLab CI (`.gitlab-ci.yml`), และ Jenkins (`Jenkinsfile`)
- **Strict Quality Gates:**
  1. *Coverage Gate:* บังคับผ่าน `test:coverage` (100% Domain, 75%+ Services) หากไม่ผ่าน CI จะล้มเหลวทันที
  2. *Database Rollback Gate:* รันคำสั่ง `liquibase update-testing-rollback` ก่อนรัน integration test เพื่อรับประกันว่าทุก migration script มี rollback script ที่ทำงานได้จริงและปลอดภัยต่อ Production Database

---

## 3. ตารางสรุปผลงาน Labs 00 – 08 (Summary of Workshop Labs)

| Lab | หัวข้อการเรียนรู้ | กิ่งบน GitHub (Branch) | สิ่งที่ส่งมอบและผลการทดสอบ |
|:---:|---|---|---|
| **00** | Environment Setup | [`jest/lab/00-setup`](https://github.com/jeerang/projectvv/tree/jest/lab/00-setup) | `npm run doctor` ผ่าน 9/9 ข้อ, รัน Playwright E2E ผ่าน |
| **01** | Test Boundaries | [`jest/lab/01-boundaries`](https://github.com/jeerang/projectvv/tree/jest/lab/01-boundaries) | กรอกการจำแนก 16 ข้อลงใน [`worksheet.md`](labs/01-boundaries/worksheet.md) |
| **02** | AAA & Test Smells | [`jest/lab/02-aaa-unit`](https://github.com/jeerang/projectvv/tree/jest/lab/02-aaa-unit) | ลบ smelly test แยกเป็น 4 ไฟล์ย่อย AAA unit tests (21 tests ผ่าน) |
| **03** | Test Doubles | [`jest/lab/03-test-doubles`](https://github.com/jeerang/projectvv/tree/jest/lab/03-test-doubles) | In-memory Fake Repos, Dummy, Stub, Spy, Mock, Fake, Fake Timers (38 tests ผ่าน) |
| **04** | Test Data Management | [`jest/lab/04-test-data`](https://github.com/jeerang/projectvv/tree/jest/lab/04-test-data) | Builders, `seedFaker`, Contract test, DB truncate isolation (52 tests ผ่าน) |
| **05** | Continuous Integration | [`jest/lab/05-ci`](https://github.com/jeerang/projectvv/tree/jest/lab/05-ci) | CI Workflows (GitHub/GitLab/Jenkins) + Coverage Gate + Rollback Gate |
| **06** | Outside-In TDD | [`jest/lab/06-outside-in`](https://github.com/jeerang/projectvv/tree/jest/lab/06-outside-in) | Double-loop TDD: Playwright E2E + Liquibase 005 + PollService + Routes |
| **07** | Legacy Code | [`jest/lab/07-legacy`](https://github.com/jeerang/projectvv/tree/jest/lab/07-legacy) | Characterization test, Seams injection, Sprout `ballotRules` (48 unit / 32 int ผ่าน) |
| **08** | Readiness Checklist | [`jest/lab/08-own-project`](https://github.com/jeerang/projectvv/tree/jest/lab/08-own-project) | ประเมิน [`checklist/README.md`](checklist/README.md) ได้ 24/24 คะแนนเต็ม |
| **Own** | Own Project Integration | [`testing-workshop`](https://github.com/jeerang/projectvv/tree/testing-workshop) | ติดตั้ง Test Harness ให้ระบบเลือกตั้ง Express + TS + Prisma พร้อมรันเทสผ่าน |

---

## 4. ผลการประเมินตนเอง (Readiness Checklist Evaluation)

บันทึกการประเมินในเอกสาร [`checklist/README.md`](checklist/README.md):

- **รอบที่ 1 (Day 1 เช้า ก่อนเริ่ม Workshop): ได้คะแนน 4 / 24 คะแนน**  
  สถานะเดิมของโปรเจกต์ยังขาดการแยก Unit/Integration, ไม่มี Automated Migration สำหรับการทดสอบ และโค้ดผูกติดกับ Global Instance ขาด Seam ในการทดสอบ
- **รอบที่ 2 (Day 2 ท้ายวัน หลังจบ Workshop): ได้คะแนน 24 / 24 คะแนนเต็ม**  
  ระบบได้รับการยกระดับสู่ Automated Testing ระดับมาตรฐานอุตสาหกรรม มีการแยก Boundary, รันคำสั่งเดียวผ่าน, มี CI Quality Gate, ใช้ Builders และจัดการ Legacy Code ได้อย่างปลอดภัย

---

## 5. การนำไปประยุกต์ใช้กับโปรเจกต์จริง (Own Project Integration)

ได้ดึงซอร์สโค้ดระบบ Backend การเลือกตั้งจริง (`thanapon1406/953713-software-backend-development-final-project`) เข้ามาติดตั้งชุดเทมเพลตบนกิ่ง [`testing-workshop`](https://github.com/jeerang/projectvv/tree/testing-workshop):

1. **สถาปัตยกรรม Seam แรก (`src/app.ts`):** แยกการสร้างและกำหนดค่า Express instance ออกจาก `src/server.ts` เพื่อให้ `supertest(createApp())` ทดสอบได้ทันทีโดยไม่ต้องเปิด Listening Port 3000
2. **การจัดการฐานข้อมูลทดสอบ (Prisma):** ตั้งค่า `docker-compose.test.yml` รัน PostgreSQL 17 บน port 5433 (tmpfs) และสร้างฟังก์ชัน `truncateAll()` ผ่าน Prisma Client เพื่อทำ Test Isolation
3. **การทดสอบจริง:**
   - **Unit Test ([`test/unit/roleMiddleware.test.ts`](https://github.com/jeerang/projectvv/blob/testing-workshop/own-project/test/unit/roleMiddleware.test.ts)):** ทดสอบ Authorization Role Middleware ตามหลัก AAA ครอบคลุมเคส 401, 403 และ Next (ผ่าน 3/3 tests)
   - **Integration Test ([`test/integration/health.test.ts`](https://github.com/jeerang/projectvv/blob/testing-workshop/own-project/test/integration/health.test.ts)):** ทดสอบ Endpoint `GET /` ผ่าน Supertest (ผ่าน 1/1 test)

---

## 6. เอกสารอ้างอิงทางวิชาการ (References)

1. **Clemson, T.** (2014). *Testing Strategies in a Microservice Architecture*. Martin Fowler's Bliki. [https://martinfowler.com/articles/microservice-testing/](https://martinfowler.com/articles/microservice-testing/)
2. **Meszaros, G.** (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley Professional. [http://xunitpatterns.com/](http://xunitpatterns.com/)
3. **Fowler, M.** (2007). *Mocks Aren't Stubs*. Martin Fowler's Articles. [https://martinfowler.com/articles/mocksArentStubs.html](https://martinfowler.com/articles/mocksArentStubs.html)
4. **Freeman, S., & Pryce, N.** (2009). *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley Professional.
5. **Feathers, M.** (2004). *Working Effectively with Legacy Code*. Prentice Hall.
6. **Humble, J., & Farley, D.** (2010). *Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation*. Addison-Wesley.
