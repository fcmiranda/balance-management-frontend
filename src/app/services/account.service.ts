import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account, TransactionRequest, Transaction } from '../models/account.model';
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

  constructor(private http: HttpClient) {}

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
          this.errorSubject.next(error.error?.message || 'Failed to load accounts');
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
          this.errorSubject.next(error.error?.message || 'Failed to load account');
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
          this.errorSubject.next(error.error?.message || 'Failed to create account');
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
          this.errorSubject.next(error.error?.message || 'Deposit failed');
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
          this.errorSubject.next(error.error?.message || 'Withdrawal failed');
          this.processingSubject.next(false);
        }
      })
    );
  }

  selectAccount(account: Account | null): void {
    this.selectedAccountSubject.next(account);
  }

  private updateAccountInList(updatedAccount: Account): void {
    const currentAccounts = this.accountsSubject.value;
    const updatedAccounts = currentAccounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    );
    this.accountsSubject.next(updatedAccounts);
    
    if (this.selectedAccountSubject.value?.id === updatedAccount.id) {
      this.selectedAccountSubject.next(updatedAccount);
    }
  }

  get totalBalance(): number {
    return this.accountsSubject.value.reduce((total, account) => total + account.balance, 0);
  }
}
