# File Creation Rules

- NEVER create `.zip` files anywhere in the workspace unless the user EXPLICITLY requests it. Creating zip files can cause API keys to leak if committed to git.
- If asked to "build for FTP" or deploy, do NOT automatically compress the build output into a zip file. Simply build the folder (e.g. `dist/`) and inform the user that the folder is ready for them to upload.

# Project Workflow Rules

- לפני כל משימה, קרא את implementation_plan.md כדי להבין את המצב.
- בסוף כל משימה, עדכן את implementation_plan.md: סמן מה הושלם והוסף משימות חדשות אם צריך.
- לעולם אל תערוך קובץ לפני שתקרא את תוכנו המעודכן מהדיסק (באמצעות כלי קריאה) כדי לא לדרוס שינויים.
- לעולם אל תשמור או תבצע git commit ללא אישור מפורש מראש מהמשתמש.
- אל תמחק או תדרוס קבצים ישנים רק בגלל שהם נראים כפולים או דומים לשם חדש - במידת הצורך צור קובץ עם שם חדש.
- תמיד תציג תוכנית עבודה מסודרת ואת הפעולות שאתה עומד לבצע (כולל אילו קבצים ישתנו) לפני שאתה מתחיל לבצע שינויים בקוד.

# Code Writing Lock (2424 / 901212)
- **הפעלת נעילה (2424):** אם המשתמש מקליד '2424', על ה-Agent להיכנס מיד למצב "LOCKED". במצב זה חל איסור מוחלט לכתוב, לערוך, ליצור קבצים או להריץ סקריפטים שמשנים את הקוד.
- **שחרור מנעילה (901212):** ה-Agent יישאר נעול עד שהמשתמש יקליד '901212', ורק לאחר מכן יחזור לפעילות רגילה.
