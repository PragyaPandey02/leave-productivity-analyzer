# Leave & Productivity Analyzer

A full-stack web application that analyzes employee attendance, leave usage, and productivity based on uploaded Excel attendance sheets.

The system automatically calculates worked hours, expected working hours, leave usage, and productivity percentage for employees, following predefined business rules.

---

##  Features

- Upload Excel (.xlsx) attendance files
- Automatic attendance parsing and validation
- Leave detection based on missing attendance
- Monthly expected vs actual working hours calculation
- Productivity percentage calculation
- Employee-wise attendance dashboard
- MongoDB database integration
- Fully deployed on Vercel

---

##  Business Rules Implemented

- **Working Days (Monday – Friday):**  
  8.5 hours per day (10:00 AM – 6:30 PM)

- **Saturday:**  
  Half day – 4 hours (10:00 AM – 2:00 PM)

- **Sunday:**  
  Non-working day

- **Leave Policy:**  
  - 2 leaves allowed per employee per month  
  - Missing attendance on working days is counted as leave

- **Productivity Formula:** 
Productivity (%) = (Actual Worked Hours / Expected Working Hours) × 100



---

##  Excel File Format

The uploaded Excel file must contain the following columns:

| Column Name     | Description              |
|-----------------|--------------------------|
| Employee Name   | Name of the employee     |
| Date            | Attendance date          |
| In-Time         | Login time               |
| Out-Time        | Logout time              |

> Excel dates and times are automatically converted and processed by the backend.

---

##  Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM
- MongoDB Atlas

### Deployment
- Vercel (Frontend & Backend)
- GitHub (Version Control)

---

##  Project Structure
leave-productivity-analyzer/
├── app/
│ ├── api/
│ │ └── upload/
│ │ └── route.ts
│ ├── page.tsx
├── lib/
│ └── prisma.ts
├── prisma/
│ └── schema.prisma
├── public/
├── .env
├── package.json
├── next.config.ts
├── README.md


---

## Environment Variables

Create a `.env` file in the root directory and add:
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority


---

## ▶️ Running the Project Locally

1. Clone the repository
   ```bash
   git clone https://github.com/PragyaPandey02/leave-productivity-analyzer.git
2. Install dependencies
npm install

3. Generate Prisma client
npx prisma generate

4. Start the development server
npm run dev

5. Open browser
http://localhost:3000

** Live Demo

🔗 Deployed on Vercel:
(https://vercel.com/pragyapandey02s-projects/leave-productivity-analyzer-vercel/BuUnqSjBBQdZX2ZGybo1tTwcFp6z)

 ** Future Improvements

Month and employee filtering

Export reports to Excel/PDF

Role-based access (Admin / Employee)

Charts for productivity visualization

** Author
Pragya Pandey

** License
This project is created for educational and assignment purposes.


---

### What to do now
1. Open **README.md**
2. Replace everything with the content above
3. Save
4. Commit & push:

### Dashboard Screenshots
1) Uploading xl sheet 
<img width="952" height="364" alt="image" src="https://github.com/user-attachments/assets/69fa2559-b8ac-4475-916a-df230b1af6ee" />

2) Data saved successfully
<img width="567" height="176" alt="image" src="https://github.com/user-attachments/assets/ebea6fb5-d7f9-4296-b52f-6a4e65d9ed2d" />

3) The normal dashboard
<img width="947" height="896" alt="image" src="https://github.com/user-attachments/assets/69996c13-17ca-411a-998e-034ba1c98ea6" />

<img width="921" height="890" alt="image" src="https://github.com/user-attachments/assets/b1b01952-7f85-4137-a7bb-05541080dadd" />

4) Filtering on the basis of Month and Employee
<img width="922" height="886" alt="image" src="https://github.com/user-attachments/assets/16a4211f-0fe3-462f-9e72-b586a5066c51" />

<img width="943" height="907" alt="image" src="https://github.com/user-attachments/assets/f7992819-86c4-444d-8834-4efaa10d4265" />








