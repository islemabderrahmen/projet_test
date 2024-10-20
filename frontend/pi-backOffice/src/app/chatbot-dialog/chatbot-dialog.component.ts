import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../service/user-service.service';
import { loadStripe } from '@stripe/stripe-js';
import {  Stripe, StripeCardElement } from '@stripe/stripe-js';
import { of, throwError } from 'rxjs';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {  waitForAsync } from '@angular/core/testing';

import { ChatMessage } from '../model/ChatMessage';

declare var Stripe: any; // Déclarer Stripe pour éviter les erreurs TypeScript

@Component({
  selector: 'app-chatbot-dialog',
  templateUrl: './chatbot-dialog.component.html',
  styleUrls: ['./chatbot-dialog.component.css'],
  animations: [
    trigger('triggerAnimation', [
      // Vous pouvez définir votre animation ici
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ChatbotDialogComponent  {
  stripePromise = loadStripe('pk_test_51P4NGxRt7CIhgIC0089qYLfXFOnIfnFTnE5QdUmnYBt5qSewnVR2TnMJSo2cKfoYnedjpkLa19HJ10Ud4roZbaF900QkKN22LO');
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  showVirusAd: boolean = true;
  showAnnouncement: boolean = true; // Control the display of the announcement
  isVisible: boolean = true;
 

  closeAd(): void {
    this.isVisible = false;
  }
  closeAnnouncement(): void {
    this.showAnnouncement = false; // Cache l'annonce
  }

  closeVirusAd() {
    this.showVirusAd = false;
  }
  isChatVisible: boolean = true;
  messages: { text: string, sender: 'user' | 'bot', suggestions?: string[] }[] = [];
  @Output() closeChatbot = new EventEmitter<void>();
  userInput: string = '';

  toggleChatVisibility() {
    this.isChatVisible = !this.isChatVisible;
  }
  


  sendMessage(message: string) {
    if (!message) return;
    this.messages.push({ text: message, sender: 'user' });
    this.processMessage(message);
    this.userInput = '';
    
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length) {
      const file: File = input.files[0];
      console.log(file.name);
      // Envoyer le nom du fichier comme message ou traiter le fichier comme nécessaire
      this.sendMessage(`Fichier joint : ${file.name}`);
    }
  }
  
  
  getTimeBasedGreeting(): string {
    const hour = new Date().getHours(); // Obtient l'heure actuelle
    if (hour < 12) {
      return "Bonne matinée ! Comment puis-je vous aider ?";
    } else if (hour < 18) {
      return "Bonne après-midi ! Avez-vous des questions pour moi ?";
    } else {
      return "Bonsoir ! Je suis là pour vous aider.";
    }
  }
  
  getDayBasedMessage(): string {
    const day = new Date().getDay(); // Obtient le jour actuel (0 = Dimanche, 1 = Lundi, etc.)
    switch (day) {
      case 1:
        return "C'est lundi, une nouvelle semaine commence !";
      case 5:
        return "C'est vendredi, le week-end est proche !";
      case 6:
      case 0:
        return "Profitez de votre week-end !";
      default:
        return "Bonne journée ! Comment puis-je vous assister ?";
    }
  }
  


  processMessage(message: string) {
    let response = 'Je ne comprends pas la question.';
    let suggestions: string[] = [];
    message = message.toLowerCase();


    
    if (message.includes("heure") || message.includes("temps")) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      response = `Il est actuellement ${hours}h${minutes < 10 ? '0' + minutes : minutes}.`;
  } 
  
    // Conditions for responding to user messages
    if (message.includes("quand")) {
      response = "Le forum d'entreprise aura lieu le 25 Octobre 2024.";suggestions = [
        "Quand aura lieu le forum d'entreprise ?",
        "Où se déroulera le forum ?",
        "Quel est le thème du forum cette année ?",
        "Comment puis-je m'inscrire ?",
      ];
    }
     else if (message.includes("où")) {
      response = "Il se déroulera au Centre de Conventions Internationales, Paris.";
      suggestions = [
        "Quand aura lieu le forum d'entreprise ?",
        "Où se déroulera le forum ?",
        "Quel est le thème du forum cette année ?",
        "Comment puis-je m'inscrire ?",
      ];
    } else   if (message.includes('salut') || message.includes('bonjour')) {
      response = 'Salut ! Comment puis-je vous aider ?';
      suggestions = [
        "Quand aura lieu le forum d'entreprise ?",
        "Où se déroulera le forum ?",
        "Quel est le thème du forum cette année ?",
        "Comment puis-je m'inscrire à une formation ?",
        "Je veux en savoir plus sur la préparation du CV."
      ];
    } else if (message.includes("formation")) {
      response = "Nous proposons les formations suivantes. Veuillez choisir une option:";
      suggestions = ["Préparation de CV", "Préparation d'entretien", "Techniques de négociation"];
    // Confirmation de la sélection de la formation
    } else if (message.includes("préparation de cv")) {
      response = "Vous avez choisi la formation 'Préparation de CV'. Voulez-vous procéder au paiement ?";
      suggestions = ["Oui, procéder au paiement", "Non, choisir une autre formation"];
    // Confirmation pour procéder au paiement
    } else if (message.includes("procéder au paiement")) {
      this.setupPayment();
      return;  // Return immediately since we handle the payment setup differently
    }
    

    
      
    
     else if (message.includes("thème") || message.includes("sujet")) {
      response = "Le thème de notre forum d'entreprise cette année est 'Innovation et Collaboration'.";
      suggestions = [
        "Qui sont les intervenants ?",
        "Comment s'inscrire ?",
      ];
    }  else if (message.includes("accessibilité")) {
      response = "Le lieu est entièrement accessible aux personnes à mobilité réduite.";
    } else if (message.includes("transport") || message.includes("parking")) {
      response = "Des informations sur le transport et le parking sont disponibles sur notre site.";
    } else if (message.includes("hébergement")) {
      response = "Nous avons des partenariats avec des hôtels à proximité. Plus de détails sur notre site.";
    } else if (message.includes("application mobile")) {
      response = "Téléchargez notre application mobile pour rester informé pendant l'événement.";
    } else if (message.includes("sécurité")) {
      response = "Nous suivons des protocoles de sécurité stricts pour assurer le bien-être de tous les participants.";
    } // Continuez à ajouter des conditions pour les autres points...
    else if (message.includes('comment') && message.includes('inscrire')) {
      response = "Pour vous inscrire, veuillez visiter notre page d'inscription sur notre site web et remplir le formulaire. Si vous avez besoin d'aide supplémentaire, n'hésitez pas à nous contacter.";
      // Vous pouvez également ajouter des suggestions ici si nécessaire, par exemple :
      suggestions = ["Quel est le coût de l'inscription ?", "Quels documents sont nécessaires pour l'inscription ?"];
    }
    // Exemple d'ajout pour tous les points mentionnés
    // ...
    else if (message.includes("réseaux sociaux")) {
      response = "Suivez-nous sur les réseaux sociaux et partagez votre expérience avec #NotreHashtag.";
    } else if (message.includes("vente de produits") || message.includes("merchandising")) {
      response = "Des produits officiels de l'événement sont disponibles à notre stand de merchandising.";
    } else if (message.includes("sessions virtuelles")) {
      response = "Des sessions virtuelles sont disponibles pour les participants ne pouvant pas assister en personne.";
    } else if (message.includes("politique d'annulation")) {
      response = "Consultez notre politique d'annulation sur notre site web pour plus d'informations.";
    } else if (message.includes("sessions q&a")) {
      response = "Les sessions de questions-réponses auront lieu après chaque conférence. Ne les manquez pas !";
    } else if (message.includes("opportunités de sponsorisation")) {
      response = "Intéressé par des opportunités de sponsorisation ? Contactez-nous pour en savoir plus.";
    } else if (message.includes("événements sociaux")) {
      response = "Ne manquez pas nos événements sociaux pour un networking de qualité.";
    } else if (message.includes("galerie photo") || message.includes("galerie vidéo")) {
      response = "Retrouvez les photos et vidéos de l'événement sur notre galerie en ligne après l'événement.";
    } else {
      response = "Désolé, je n'ai pas de réponse à votre question pour le moment. Veuillez reformuler ou poser une autre question.";
    }

    this.messages.push({ text: response, sender: 'bot', suggestions: suggestions });
  }

  onSuggestionClick(suggestion: string) {
    this.sendMessage(suggestion);
  }
  compileDiscussion(): string {
    return this.messages.map(message => {
      const sender = message.sender === 'user' ? 'Vous' : 'Chatbot';
      return `${sender}: ${message.text}\n`;
    }).join('');
  }

  downloadDiscussion(): void {
    const discussion = this.compileDiscussion();
    const blob = new Blob([discussion], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discussion-chatbot.txt'; // Nom du fichier Ã  tÃ©lÃ©charger
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  

  close() {
    this.closeChatbot.emit();
  }

  

  constructor(private userService: UserService, ) {    }

  async ngOnInit() {
    this.stripe = await this.stripePromise;
    if (this.stripe) {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    } else {
      console.error('Failed to load Stripe');
      // Optionally, notify the user that Stripe didn't load
    }
  }



  showStripeCardInput() {
    if (!this.stripe) {
      this.sendMessage("Erreur de chargement du système de paiement. Veuillez réessayer plus tard.");
      return;
    }
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');  // Make sure this ID exists in your HTML
  }

  async submitPayment(amount: number, currency: string) {
    if (!this.card || !this.stripe) {
      this.sendMessage("Le système de paiement n'est pas correctement initialisé.");
      return;
    }

    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      this.sendMessage(`Erreur de paiement : ${error.message}`);
    } else if (token) {
      this.userService.processPayment(token.id, amount, currency).subscribe({
        next: response => {
          this.sendMessage('Paiement réussi ! Merci pour votre achat.');
        },
        error: err => {
          this.sendMessage("Le traitement de votre paiement a échoué. Veuillez réessayer plus tard.");
        }
      });
    }
  }
  
 
  
  setupPayment() {
    this.sendMessage('Veuillez entrer vos informations de paiement ci-dessous:');
    this.showStripeCardInput();  // Function to show Stripe input form
  }



  
  
  

}
