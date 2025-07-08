import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account, TransactionRequest, Transaction } from '../models/account.model';
import { ErrorMappingService } from './error-mapping.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/accounts`;
  
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  private selectedAccountSubject = new BehaviorSubject<Account | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private processingSubject = new BehaviorSubject<boolean>(false);

  public accounts$ = this.accountsSubject.asObservable();
  public selectedAccount$ = this.selectedAccountSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public processing$ = this.processingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorMappingService: ErrorMappingService
  ) {}

  getAccounts(): Observable<Account[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.get<Account[]>(this.apiUrl).pipe(
      tap(accounts => {
        this.accountsSubject.next(accounts);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  getAccountById(accountId: number): Observable<Account> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.get<Account>(`${this.apiUrl}/${accountId}`).pipe(
      tap(account => {
        this.selectedAccountSubject.next(account);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  getTransactions(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/${accountId}/transactions`);
  }

  createAccount(): Observable<Account> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.post<Account>(this.apiUrl, {}).pipe(
      tap(newAccount => {
        const currentAccounts = this.accountsSubject.value;
        this.accountsSubject.next([...currentAccounts, newAccount]);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  deposit(accountId: number, amount: number, description?: string): Observable<Account> {
    this.processingSubject.next(true);
    this.errorSubject.next(null);
    
    const transactionData: TransactionRequest = { amount, description };
    
    return this.http.post<Account>(`${this.apiUrl}/${accountId}/deposit`, transactionData).pipe(
      tap(updatedAccount => {
        this.updateAccountInList(updatedAccount);
        this.processingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.processingSubject.next(false);
        }
      })
    );
  }

  withdraw(accountId: number, amount: number, description?: string): Observable<Account> {
    this.processingSubject.next(true);
    this.errorSubject.next(null);
    
    const transactionData: TransactionRequest = { amount, description };
    
    return this.http.post<Account>(`${this.apiUrl}/${accountId}/withdraw`, transactionData).pipe(
      tap(updatedAccount => {
        this.updateAccountInList(updatedAccount);
        this.processingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.processingSubject.next(false);
        }
      })
    );
  }

  deleteAccount(accountId: number): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.delete<void>(`${this.apiUrl}/${accountId}`).pipe(
      tap(() => {
        const currentAccounts = this.accountsSubject.value;
        this.accountsSubject.next(currentAccounts.filter(account => account.id !== accountId));
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  selectAccount(account: Account | null): void {
    this.selectedAccountSubject.next(account);
  }

  private updateAccountInList(updatedAccount: Account) {
    const currentAccounts = this.accountsSubject.value;
    const index = currentAccounts.findIndex(a => a.id === updatedAccount.id);
    if (index !== -1) {
      currentAccounts[index] = updatedAccount;
      this.accountsSubject.next([...currentAccounts]);
    }
  }

  get totalBalance(): number {
    return this.accountsSubject.value.reduce((total, account) => total + account.balance, 0);
  }
}
