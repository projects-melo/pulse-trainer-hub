
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Users, Calendar, BarChart2, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transforme seu <span className="text-primary">treinamento</span> com o FitPulse
              </h1>
              <p className="text-lg text-muted-foreground">
                A plataforma completa que conecta personal trainers e alunos para alcançar resultados excepcionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/cadastro">Comece Agora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/sobre">Saiba mais</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29uYWwlMjB0cmFpbmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80"
                  alt="Personal trainer e aluno"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Resultados</p>
                    <p className="text-xs text-muted-foreground">Acompanhamento em tempo real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa em um só lugar</h2>
            <p className="text-muted-foreground">
              FitPulse oferece ferramentas completas para personal trainers e alunos gerenciarem seus treinos de forma eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Inteligente</h3>
              <p className="text-muted-foreground">
                Gerencie suas sessões de treinamento com um sistema de agendamento intuitivo e flexível.
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise de Progresso</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso dos alunos com gráficos detalhados e métricas personalizadas.
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Alunos</h3>
              <p className="text-muted-foreground">
                Organize informações e acompanhe o progresso de todos os seus alunos em um único lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Transformando Vidas</h2>
            <p className="text-muted-foreground">
              Veja o que nossos usuários estão dizendo sobre o FitPulse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background border rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">CP</span>
                </div>
                <div>
                  <h3 className="font-semibold">Carlos Pereira</h3>
                  <p className="text-sm text-muted-foreground">Personal Trainer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "O FitPulse revolucionou a maneira como gerencio meus alunos. Agora posso acompanhar o progresso de cada um de forma detalhada e personalizada."
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">LS</span>
                </div>
                <div>
                  <h3 className="font-semibold">Luísa Santos</h3>
                  <p className="text-sm text-muted-foreground">Aluna</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Ver meu progresso nos gráficos me motiva a continuar. A comunicação direta com meu personal também facilita muito quando tenho dúvidas."
              </p>
            </div>

            <div className="bg-background border rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">RM</span>
                </div>
                <div>
                  <h3 className="font-semibold">Rafael Mendes</h3>
                  <p className="text-sm text-muted-foreground">Personal Trainer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Conseguir agendar as sessões e controlar os pagamentos em um só lugar me economiza muito tempo. Recomendo para todos os profissionais da área."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para transformar seus treinos?</h2>
            <p className="text-muted-foreground mb-8">
              Junte-se a milhares de personal trainers e alunos que estão revolucionando sua experiência de treino com o FitPulse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-12 md:py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Dados Seguros</h3>
              <p className="text-sm text-muted-foreground">
                Sua privacidade é nossa prioridade. Todos os dados são criptografados e seguros.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Resultados Reais</h3>
              <p className="text-sm text-muted-foreground">
                Ferramentas baseadas em ciência para acompanhar o progresso de forma precisa.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Comunidade</h3>
              <p className="text-sm text-muted-foreground">
                Faça parte de uma comunidade de profissionais e alunos dedicados ao bem-estar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
