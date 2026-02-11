"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Ticket, Info } from "lucide-react"
import Image from "next/image"
import type { Tour, Media } from "@/types/payload"
import { getMediaUrl } from "@/types/payload"
import { useI18n, Language } from "@/lib/i18n-context"

interface TourSectionProps {
  tours?: Tour[]
}

// Helper para formatar a data com suporte a idiomas
function formatTourDate(dateString: string, language: Language) {
  const date = new Date(dateString)
  
  const months: Record<Language, string[]> = {
    pt: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
    en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    fr: ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC']
  }
  
  const days: Record<Language, string[]> = {
    pt: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  }
  
  return {
    formatted: `${months[language][date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`,
    day: days[language][date.getDay()]
  }
}

export function TourSection({ tours }: TourSectionProps) {
  const { t, language } = useI18n()
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
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-secondary font-serif">{t("tour.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("tour.subtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 px-4">
          {shows.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-secondary/30 bg-background/80">
              <p className="text-xl text-muted-foreground">{t("tour.noShows")}</p>
            </Card>
          ) : (
            shows.map((show, index) => {
            const dateInfo = formatTourDate(show.date, language)
            const eventImageUrl = getMediaUrl(show.eventImage as Media | string | undefined)
            return (
            <Card
              key={show.id || index}
              className="overflow-hidden border-2 border-secondary/30 bg-background/80 backdrop-blur-sm hover:border-primary transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Cartaz/Imagem do Evento */}
                {eventImageUrl && (
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <Image
                      src={eventImageUrl}
                      alt={show.venue || "Evento"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-6">
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
                      {show.hasTickets ? (
                        // Com venda de ingressos - mostra status
                        show.status === "sold-out" ? (
                          <Button
                            disabled
                            variant="outline"
                            className="w-full sm:w-auto bg-muted text-muted-foreground border-2"
                          >
                            {t("tour.soldOut")}
                          </Button>
                        ) : (
                          <>
                            <Button 
                              asChild={!!show.ticketUrl}
                              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-secondary shadow-lg"
                            >
                              {show.ticketUrl ? (
                                <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                                  <Ticket className="mr-2 h-4 w-4" />
                                  {t("tour.tickets")}
                                </a>
                              ) : (
                                <>
                                  <Ticket className="mr-2 h-4 w-4" />
                                  {t("tour.tickets")}
                                </>
                              )}
                            </Button>
                            {show.status === "few-tickets" && (
                              <p className="text-xs text-secondary font-bold mt-1 text-center">{t("tour.fewTickets")}</p>
                            )}
                          </>
                        )
                      ) : (
                        // Sem venda de ingressos - mostra "Mais informações"
                        <Button 
                          asChild={!!show.ticketUrl}
                          variant="outline"
                          className="w-full sm:w-auto border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent text-secondary shadow-lg"
                        >
                          {show.ticketUrl ? (
                            <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                              <Info className="mr-2 h-4 w-4" />
                              {t("tour.moreInfo")}
                            </a>
                          ) : (
                            <>
                              <Info className="mr-2 h-4 w-4" />
                              {t("tour.moreInfo")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )})
          )}
        </div>
        </div>

        {/* <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent text-secondary shadow-lg"
          >
            <Calendar className="mr-2 h-5 w-5" />
            {t("tour.viewAll")}
          </Button>
        </div> */}
    </section>
  )
}
