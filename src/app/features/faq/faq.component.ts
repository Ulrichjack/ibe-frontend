import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucidePlus, LucideMinus } from '@lucide/angular';
import { ContactModalComponent } from '../messages/ui/contact-modal/contact-modal.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    LucidePlus,
    LucideMinus,
    ContactModalComponent,
  ],
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {
  private seoService = inject(SeoService);

  openIndex = signal<number | null>(0);
  showContactModal = signal(false);
  
  faqs = [
    {
      question: "Peut-on payer les frais de formation en plusieurs fois ?",
      answer: "Oui, absolument ! Nous comprenons que l'investissement dans une formation est important. C'est pourquoi nous proposons des facilités de paiement en 2 ou 3 tranches selon la durée de la formation choisie."
    },
    {
      question: "Faut-il un niveau scolaire particulier pour s'inscrire ?",
      answer: "Non, nos formations sont accessibles à tous (niveau CEP minimum, à partir de 15 ans). Ce qui compte le plus pour nous, c'est votre motivation, votre passion pour la beauté et votre envie d'apprendre."
    },
    {
      question: "Le kit professionnel est-il vraiment inclus dans le prix ?",
      answer: "Oui ! Dès le premier jour de votre formation, nous vous remettons un kit professionnel complet correspondant à votre spécialité (Onglerie, Make-up, Coiffure...). Vous n'avez rien à acheter en plus pour pratiquer."
    },
    {
      question: "Le certificat est-il reconnu officiellement ?",
      answer: "Oui, l'Institut Beauty's Empire est agréé par l'État. À la fin de votre cursus et après réussite de vos examens, vous recevez un certificat reconnu par le MINEFOP (Ministère de l'Emploi et de la Formation Professionnelle)."
    },
    {
      question: "Comment se déroule le stage pratique ?",
      answer: "La pratique est au cœur de notre pédagogie. Selon votre formation, un stage de 1 à 2 mois est garanti. Il s'effectue soit au sein de notre institut d'application, soit chez l'un de nos partenaires prestigieux à Yaoundé."
    },
    {
      question: "Comment payer les frais d'inscription ?",
      answer: "Vous pouvez régler vos frais d'inscription par Orange Money, MTN Mobile Money, ou en espèces directement au secrétariat de l'un de nos campus (Tsinga ou Nkoabang)."
    }
  ];

  ngOnInit() {
    this.seoService.setPageSeo(
      "Questions Fréquentes (FAQ)",
      "Toutes les réponses sur les formations IBE : frais, paiement, certificat MINEFOP, stage pratique, kit professionnel à Yaoundé, Cameroun."
    );
    this.seoService.setFaqSchema(this.faqs);
  }

  toggleQuestion(index: number) {
    this.openIndex.update(current => current === index ? null : index);
  }

  openContactModal() {
    this.showContactModal.set(true);
  }
}