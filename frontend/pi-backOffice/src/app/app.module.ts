import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboradComponent } from './screens/dashborad/dashborad.component';
import { ProfileComponent } from './acount/profile/profile.component';
import { SignInComponent } from './acount/sign-in/sign-in.component';
import { SignUpComponent } from './acount/sign-up/sign-up.component';
import { CandidatureComponent } from './candidature management/candidature/candidature.component';
import { NavbarComponent } from './globals/navbar/navbar.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RequestsComponent } from './requests management/requests/requests.component';
import { AddRequestComponent } from './requests management/add-request/add-request.component';
import { InvoicesComponent } from './invoices management/invoices/invoices.component';
import { AddInvoiceComponent } from './invoices management/add-invoice/add-invoice.component';
import { DevisComponent } from './devis management/devis/devis.component';
import { AddDevisComponent } from './devis management/add-devis/add-devis.component';
import { UpdateInvoiceComponent } from './invoices management/update-invoice/update-invoice.component';
import { UpdateDevisComponent } from './devis management/update-devis/update-devis.component';
import { UpdateRequestComponent } from './requests management/update-request/update-request.component';
import { UpdateComponent } from './candidature management/candidature/update.component';
import { InterviewComponent } from './interview/interview.component';
import { ListInterviewComponent } from './interview/list-interview/list-interview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './globals/not-found/not-found.component';
import { EmailVerificationComponent } from './globals/email-verification/email-verification.component';
import { NotApprovedComponent } from './globals/not-approved/not-approved.component';
import { UpdateProfileComponent } from './acount/update-profile/update-profile.component';
import { AssociationsComponent } from './Users/associations/associations.component';
import { IndividualsComponent } from './Users/individuals/individuals.component';
import { UserDetailsComponent } from './Users/user-details/user-details.component';
import { OffersComponent } from './offers management/offers/offers.component';
import { AddOfferComponent } from './offers management/add-offer/add-offer.component';
import { UpdateOfferComponent } from './offers management/update-offer/update-offer.component';
import { DetailOfferComponent } from './offers management/detail-offer/detail-offer.component';
import { OfferBySocietyComponent } from './offers management/offer-by-society/offer-by-society.component';
import { IndexComponent } from './screens/index/index.component';
import { NavbarIndexComponent } from './globals/navbar-index/navbar-index.component';
import { HeaderComponent } from './globals/header/header.component';
import { ContactUsComponent } from './screens/contact-us/contact-us.component';
import { ListCandidatureComponent } from './candidature management/list-candidature/list-candidature.component';
import { PostulerComponent } from './postuler/postuler.component';
import { IndexOffersComponent } from './offers management/index-offers/index-offers.component';
import { PageOffersComponent } from './offers management/page-offers/page-offers.component';
import { ListOffersComponent } from './offers management/list-offers/list-offers.component';
import { NgModule } from '@angular/core';
import { FeedBackComponent } from './reclamation management/feed-back/feed-back.component';
import { ReclamationComponent } from './reclamation management/reclamation/reclamation.component';
import { RequestsIndexComponent } from './requests management/requests-index/requests-index.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevisBySocietyComponent } from './devis management/devis-by-society/devis-by-society.component';
import { MyInvoicesComponent } from './invoices management/my-invoices/my-invoices.component';
import { ForumComponent } from './ForumComponenets/forum/forum.component';
import { AddForumComponent } from './ForumComponenets/add-forum/add-forum.component';
import { PacksListComponent } from './PackComponents/packs-list/packs-list.component';
import { AddStandComponent } from './StandComponents/add-stand/add-stand.component';
import { StandListComponent } from './StandComponents/stand-list/stand-list.component';
import { EditPackComponent } from './PackComponents/edit-pack/edit-pack.component';
import { EditStandComponent } from './StandComponents/edit-stand/edit-stand.component';
import { EditForumComponent } from './ForumComponenets/edit-forum/edit-forum.component';
import { ForumPacksComponent } from './PackComponents/forum-packs/forum-packs.component';
import { SidebarComponent } from './globals/sidebar/sidebar.component';
import { Authentication } from './service/authentication.service';
import { AboutUsComponent } from './screens/about-us/about-us.component';
import { UpdatePassowrdComponent } from './acount/update-passowrd/update-passowrd.component';
import { ResetPassowrdComponent } from './acount/reset-passowrd/reset-passowrd.component';
import { ImagePopupComponent } from './globals/image-popup/image-popup.component';
import { PopupDialogComponent } from './globals/popup-dialog/popup-dialog.component';
import { PersonalizedPackComponent } from './PackComponents/personalized-pack/personalized-pack.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { RatingComponent } from './reclamation management/rating/rating.component';
import { FavoriteComponent } from './reclamation management/favorite/favorite.component';
import { AddPackComponent } from './PackComponents/add-pack/add-pack.component';
import { UpdateInterviewComponent } from './interview/update-interview/update-interview.component';
import { InterviewValiderComponent } from './interview/interview-valider/interview-valider.component';
import { DetailCandidatComponent } from './candidature management/detail-candidat/detail-candidat.component';
import { FooterIndexComponent } from './globals/footer-index/footer-index.component';
import { MyOldInvoicesComponent } from './invoices management/my-old-invoices/my-old-invoices.component';
import { OldInvoicesComponent } from './invoices management/old-invoices/old-invoices.component';
import { OldDevisBySocietyComponent } from './devis management/old-devis-by-society/old-devis-by-society.component';
import { AllRequestsIndexComponent } from './requests management/all-requests-index/all-requests-index.component';
import { OldRequestsComponent } from './requests management/old-requests/old-requests.component';
import { UserService } from './service/user-service.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { SponsorEditComponent } from './sponsor-edit/sponsor-edit.component';
import { ChatbotDialogComponent } from './chatbot-dialog/chatbot-dialog.component';
import { CommonModule } from '@angular/common';
import { ReclamationDetailsComponent } from './reclamation management/reclamation-details/reclamation-details.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboradComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent,
    CandidatureComponent,
    NavbarComponent,
    SidebarComponent,
    RequestsComponent,
    AddRequestComponent,
    InvoicesComponent,
    AddInvoiceComponent,
    DevisComponent,
    AddDevisComponent,
    UpdateInvoiceComponent,
    UpdateDevisComponent,
    UpdateRequestComponent,
    UpdateComponent,
    InterviewComponent,
    ListInterviewComponent,
    ReclamationComponent,
    NotFoundComponent,
    EmailVerificationComponent,
    NotApprovedComponent,
    UpdateProfileComponent,
    AssociationsComponent,
    IndividualsComponent,
    UserDetailsComponent,
    OffersComponent,
    AddOfferComponent,
    UpdateOfferComponent,
    DetailOfferComponent,
    OfferBySocietyComponent,
    IndexComponent,
    FooterIndexComponent,
    NavbarIndexComponent,
    HeaderComponent,
    ContactUsComponent,
    AboutUsComponent,
    RequestsIndexComponent,
    DevisBySocietyComponent,
    MyInvoicesComponent,
    ForumComponent,
    AddForumComponent,
    PacksListComponent,
    AddPackComponent,
    AddStandComponent,
    StandListComponent,
    EditPackComponent,
    EditStandComponent,
    EditForumComponent,
    ForumPacksComponent,
    AboutUsComponent,
    ListCandidatureComponent,
    PostulerComponent,
    AboutUsComponent,
    IndexOffersComponent,
    PageOffersComponent,
    ListOffersComponent,
    FeedBackComponent,
    AllRequestsIndexComponent,
    OldRequestsComponent,
    OldInvoicesComponent,
    MyOldInvoicesComponent,
    OldDevisBySocietyComponent,
    UpdatePassowrdComponent,
    ResetPassowrdComponent,
    ImagePopupComponent,
    PopupDialogComponent,
    PersonalizedPackComponent,
    RatingComponent,
    FavoriteComponent,
    UpdateInterviewComponent,
    InterviewValiderComponent,
    DetailCandidatComponent,
    ChatbotDialogComponent,
    SponsorEditComponent,
    UserListComponent,
    UserFormComponent,
    ReclamationDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,   
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      tapToDismiss: true,
      closeButton: true,
      preventDuplicates: true,
      progressBar: true,
      disableTimeOut: false,
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [Authentication,UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}