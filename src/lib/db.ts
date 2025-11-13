import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../posts.db');
const db = new Database(dbPath);

// Create posts table
db.exec(`
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT UNIQUE NOT NULL,
		title TEXT NOT NULL,
		date TEXT NOT NULL,
		excerpt TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
`);

// Database is ready, no sample data

export interface Post {
	id: number;
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	content: string;
	created_at: string;
	updated_at: string;
}

export const getAllPosts = (): Post[] => {
	const stmt = db.prepare('SELECT * FROM posts ORDER BY date DESC');
	return stmt.all() as Post[];
};

export const getPostBySlug = (slug: string): Post | null => {
	const stmt = db.prepare('SELECT * FROM posts WHERE slug = ?');
	return stmt.get(slug) as Post | null;
};

export const createPost = (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post => {
	const stmt = db.prepare(`
		INSERT INTO posts (slug, title, date, excerpt, content)
		VALUES (?, ?, ?, ?, ?)
	`);
	const result = stmt.run(post.slug, post.title, post.date, post.excerpt, post.content);
	const id = result.lastInsertRowid as number;
	return {
		id,
		...post,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};
};

export default db;
