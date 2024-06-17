package it.unimol.tt.oggetti.entita;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "collaboratore_tirocinio")
public class CollaboratoreTirocinio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tirocinio_id", nullable = false)
    private Tirocinio tirocinio;

    @ManyToOne
    @JoinColumn(name = "collaboratore_id", nullable = false)
    private Utente collaboratore;
}
