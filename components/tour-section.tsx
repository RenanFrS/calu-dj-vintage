import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Ticket } from "lucide-react"
import type { Tour } from "@/types/payload"

interface TourSectionProps {
  tours?: Tour[]
}

// Helper para formatar a data
function formatTourDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  
  return {
    formatted: `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`,
    day: days[date.getDay()]
  }
}

export function TourSection({ tours }: TourSectionProps) {
  const shows = tours || []

  return (
    <section id="tour" className="py-24 px-4 relative overflow-hidden bg-card/30">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #192C66 0px, #192C66 2px, transparent 2px, transparent 10px)`,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-secondary font-serif">{"Agenda de Shows"}</h2>
          <p className="text-xl text-muted-foreground">{"Próximos shows e festivais"}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 px-4">
          {shows.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-secondary/30 bg-background/80">
              <p className="text-xl text-muted-foreground">Configure no seu painel de admin!</p>
              <p className="text-sm text-muted-foreground mt-2">Adicione shows na coleção "Tours"</p>
            </Card>
          ) : (
            shows.map((show, index) => {
            const dateInfo = formatTourDate(show.date)
            return (
            <Card
              key={show.id || index}
              className="overflow-hidden border-2 border-secondary/30 bg-background/80 backdrop-blur-sm hover:border-primary transition-all duration-300 shadow-lg"
            >
              <div className="p-6">
                <div className="grid sm:grid-cols-[auto_1fr_auto] gap-6 items-center">
                  <div className="text-center border-2 border-secondary rounded-lg p-3 bg-card">
                    <div className="text-3xl font-bold text-secondary font-serif">{dateInfo.formatted}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">{dateInfo.day}</div>
                  </div>

                  {/* Venue info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground font-serif">{show.venue}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{show.location}</span>
                    </div>
                  </div>

                  <div>
                    {show.status === "sold-out" ? (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full sm:w-auto bg-muted text-muted-foreground border-2"
                      >
                        {"Esgotado"}
                      </Button>
                    ) : (
                      <Button 
                        asChild={!!show.ticketUrl}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-secondary shadow-lg"
                      >
                        {show.ticketUrl ? (
                          <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                            <Ticket className="mr-2 h-4 w-4" />
                            {"Ingressos"}
                          </a>
                        ) : (
                          <>
                            <Ticket className="mr-2 h-4 w-4" />
                            {"Ingressos"}
                          </>
                        )}
                      </Button>
                    )}
                    {show.status === "few-tickets" && (
                      <p className="text-xs text-secondary font-bold mt-1 text-center">{"Últimos ingressos!"}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )})
          )}
        </div>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent text-secondary shadow-lg"
          >
            <Calendar className="mr-2 h-5 w-5" />
            {"Ver Todos os Shows"}
          </Button>
        </div>
    </section>
  )
}
