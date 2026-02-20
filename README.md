# Smart Bookmark App

A full-stack Bookmark Manager built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## 🚀 Live Demo

https://smart-bookmark-application-three.vercel.app/

---

## Features

- **Authentication**: Secure Google OAuth sign-in via Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across all devices and tabs using Supabase Realtime.
- **UI/UX**: tailwindcss and responsive design.
- **Security**: Row Level Security (RLS) ensures users only access their own data.
-**Pvivacy**: Bookmarks are private to each other
-**Routes**: Protected routes

## Tech Stack

- **Framework**: Next.js 
- **Language**: TypeScript
- **Database**: Supabase (Database + Auth + Realtime)
- **Styling**: Tailwind CSS 
- **Deployment**: Vercel

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/vikasvishwagna/smart-bookmark-application
    cd bookmarks-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
 

3.  **Environment Variables**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
    ```

4.  ## 🗄 Database Schema

The application uses a `bookmarks` table in Supabase with Row Level Security (RLS) enabled to ensure users can only access their own data.

### 📌 Table Structure

- `id` – Unique identifier (UUID)
- `user_id` – References authenticated user (`auth.users`)
- `title` – Bookmark title
- `url` – Bookmark URL
- `created_at` – Timestamp of creation

---

### 🔐 Row Level Security (RLS)

RLS policies ensure:

- Users can only view their own bookmarks
- Users can only insert bookmarks linked to their account
- Users can only delete their own bookmarks

---

### 🛠 SQL Setup

Run the following SQL inside the **Supabase SQL Editor**:

```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

alter table bookmarks enable row level security;

create policy "Users can see their own bookmarks"
  on bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete using (auth.uid() = user_id);

alter publication supabase_realtime add table bookmarks;
```

5.  **Run Locally**:
    ```bash
    npm run dev
    ```


## 🧩 Challenges Faced & Solutions

### 1️⃣ Real-time Duplicate Bookmarks

**Problem:**  
When adding a bookmark in one tab, it appeared twice in the same tab but correctly once in other tabs.

**Cause:**  
The bookmark was being added manually to local state after insertion, and the Supabase Realtime listener was also adding the same bookmark when it detected the database change.

**Solution:**  
Removed the manual state update and relied fully on Supabase Realtime for INSERT events.  
Additionally, added a deduplication check to prevent duplicate entries.

---

### 2️⃣ TypeScript State Type Errors

**Problem:**  
Type mismatch errors when updating state using functional updates.

**Solution:**  
Ensured strict typing using the `Bookmark` interface and returned properly typed arrays in state setters.


## 📚 Key Learning

This project helped deepen understanding of:

- Supabase Realtime architecture
- Multi-tab synchronization
- Optimistic UI updates
- Debugging TypeScript and React key issues

## 👤 Author

**K.V.SAI VIKAS**

- GitHub: https://github.com/vikasvishwagna
- Email: vishwagnavikassai@gmail.com