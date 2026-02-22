import type {Book} from '../interfaces/book.interface'
import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '../../../environments/environment.development'

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private dummyBooks: Book[] = [
    {
      id: '1',
      name: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      price: 15.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Classic Fiction',
    },
    {
      id: '2',
      name: '1984',
      author: 'George Orwell',
      price: 12.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.9,
      category: 'Dystopian',
    },
    {
      id: '3',
      name: 'Dune',
      author: 'Frank Herbert',
      price: 22.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1614729939124-03290b5609ce?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'Science Fiction',
    },
    {
      id: '4',
      name: 'Atomic Habits',
      author: 'James Clear',
      price: 18.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.9,
      category: 'Self-Help',
    },
    {
      id: '5',
      name: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      price: 14.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1629196914275-ce27681144f2?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Fantasy',
    },
    {
      id: '6',
      name: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 20.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Science Fiction',
    },
    {
      id: '7',
      name: 'The Alchemist',
      author: 'Paulo Coelho',
      price: 13.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.6,
      category: 'Fiction',
    },
    {
      id: '8',
      name: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: 19.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.5,
      category: 'Psychology',
    },
    {
      id: '9',
      name: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      price: 24.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'History',
    },
    {
      id: '10',
      name: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      price: 29.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1629196914275-ce27681144f2?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.9,
      category: 'Fantasy',
    },
    {
      id: '11',
      name: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      price: 11.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Classic Fiction',
    },
    {
      id: '12',
      name: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      price: 10.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.3,
      category: 'Classic Fiction',
    },
    {
      id: '13',
      name: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      price: 14.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1614729939124-03290b5609ce?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.9,
      category: 'Fantasy',
    },
    {
      id: '14',
      name: 'Pride and Prejudice',
      author: 'Jane Austen',
      price: 9.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'Romance',
    },
    {
      id: '15',
      name: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      price: 12.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Biography',
    },
    {
      id: '16',
      name: 'Animal Farm',
      author: 'George Orwell',
      price: 8.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.6,
      category: 'Dystopian',
    },
    {
      id: '17',
      name: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      price: 10.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'Children\'s Fiction',
    },
    {
      id: '18',
      name: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      price: 13.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.5,
      category: 'Science Fiction',
    },
    {
      id: '19',
      name: 'Brave New World',
      author: 'Aldous Huxley',
      price: 15.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1614729939124-03290b5609ce?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.6,
      category: 'Dystopian',
    },
    {
      id: '20',
      name: 'Catch-22',
      author: 'Joseph Heller',
      price: 16.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.4,
      category: 'Satire',
    },
    {
      id: '21',
      name: 'The Shining',
      author: 'Stephen King',
      price: 18.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1629196914275-ce27681144f2?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Horror',
    },
    {
      id: '22',
      name: 'A Game of Thrones',
      author: 'George R.R. Martin',
      price: 22.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.9,
      category: 'Fantasy',
    },
    {
      id: '23',
      name: 'The Hunger Games',
      author: 'Suzanne Collins',
      price: 14.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'Young Adult',
    },
    {
      id: '24',
      name: 'The Martian',
      author: 'Andy Weir',
      price: 15.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Science Fiction',
    },
    {
      id: '25',
      name: 'The Road',
      author: 'Cormac McCarthy',
      price: 16.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.4,
      category: 'Post-Apocalyptic',
    },
    {
      id: '26',
      name: 'Gone Girl',
      author: 'Gillian Flynn',
      price: 14.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.5,
      category: 'Thriller',
    },
    {
      id: '27',
      name: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      price: 17.50,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1614729939124-03290b5609ce?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.6,
      category: 'Mystery',
    },
    {
      id: '28',
      name: 'The Book Thief',
      author: 'Markus Zusak',
      price: 13.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.8,
      category: 'Historical Fiction',
    },
    {
      id: '29',
      name: 'Life of Pi',
      author: 'Yann Martel',
      price: 15.00,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1629196914275-ce27681144f2?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.6,
      category: 'Adventure',
    },
    {
      id: '30',
      name: 'The Fault in Our Stars',
      author: 'John Green',
      price: 12.99,
      stock: 0,
      bookCover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
      averageRating: 4.7,
      category: 'Young Adult',
    },
  ]

  getBooks(): Book[] {
    return this.dummyBooks
  }

  private apiUrl = `${environment.baseUrl}/book`
  private readonly httpClient = inject(HttpClient)

  getAllBooks() {
    return this.httpClient.get<Book[]>(this.apiUrl)
  }

  getBookById(id: string) {
    return this.httpClient.get<Book>(`${this.apiUrl}/${id}`)
  }

  addBook(book: Book) {
    return this.httpClient.post<Book>(this.apiUrl, book)
  }

  updateBook(id: string, payload: Partial<Book>) {
    return this.httpClient.patch<Book>(`${this.apiUrl}/${id}`, payload)
  }

  deleteBook(id: string) {
    return this.httpClient.delete<Book>(`${this.apiUrl}/${id}`)
  }

  searchBooks(query: string) {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/search?q=${query}`)
  }

  filterBooksByCategory(categoryId: string) {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/category/${categoryId}`)
  }

  filterBooksByAuthor(authorId: string) {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/author/${authorId}`)
  }

  filterBooksByPrice(minPrice: number, maxPrice: number) {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/price?min=${minPrice}&max=${maxPrice}`)
  }
}
