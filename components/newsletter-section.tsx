import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #192C66 0px, #192C66 1px, transparent 1px, transparent 20px),
                            repeating-linear-gradient(90deg, #192C66 0px, #192C66 1px, transparent 1px, transparent 20px)`,
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8 border-4 border-secondary p-8 md:p-12 bg-card/50 backdrop-blur-sm shadow-2xl">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary border-4 border-secondary mb-4">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance text-secondary font-serif">
              {"Fique por dentro"}
            </h2>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              {"Receba as últimas novidades, lançamentos e datas de shows direto no seu email"}
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="seu@email.com"
              className="bg-background border-2 border-secondary focus:border-primary text-foreground"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-secondary shadow-lg whitespace-nowrap"
            >
              {"Inscrever-se"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">{"Sem spam. Apenas música boa e notícias importantes."}</p>
        </div>
      </div>
    </section>
  )
}
