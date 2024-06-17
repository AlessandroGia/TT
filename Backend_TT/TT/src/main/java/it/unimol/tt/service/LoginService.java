package it.unimol.tt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ArrayNode;
import it.unimol.tt.dto.CarrieraDTO;
import it.unimol.tt.dto.InsegnamentoDTO;
import it.unimol.tt.dto.UtenteDTO;
import it.unimol.tt.eccezioni.ConnessioneException;
import it.unimol.tt.eccezioni.CredenzialiErrateException;
import it.unimol.tt.eccezioni.PermessoNegatoException;
import it.unimol.tt.oggetti.entita.DocenteEsse3;
import it.unimol.tt.oggetti.entita.Utente;
import it.unimol.tt.oggetti.enums.Ruolo;
import it.unimol.tt.oggetti.request.LoginRequest;
import it.unimol.tt.oggetti.response.LoginResponse;
import it.unimol.tt.repository.DirettoreRepository;
import it.unimol.tt.repository.DocenteEsse3Repository;
import it.unimol.tt.repository.UtenteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final UtenteRepository utenteRepository;
    private final DocenteEsse3Repository docenteEsse3Repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DirettoreRepository direttoreRepository;

    public LoginResponse login(@Valid LoginRequest loginRequest) {
        Optional<Utente> utenteRichiesto = this.utenteRepository.findUtenteByNomeUtente(loginRequest.getNomeUtente());

        String jwt;
        UtenteDTO utenteDTO;
        List<CarrieraDTO> carriereDTO = null;

        String responseBody = "";
        Utente utente;
        String jwtEsse3;

        if (utenteRichiesto.isEmpty()) {
            try {
                responseBody = this.loginEsse3(loginRequest);

                utente = this.registraUtente(responseBody, loginRequest);
            } catch (CredenzialiErrateException e) {
                throw new CredenzialiErrateException("Credenziali non valide!");
            } catch (ConnessioneException | JsonProcessingException e) {
                throw new ConnessioneException("Server non raggiungibile!");
            }
        } else
            utente = utenteRichiesto.get();

        if (/*utente.getRuolo().equals(Ruolo.INTERNO) && */!this.passwordEncoder.matches(loginRequest.getPassword(), utente.getPassword()))
            throw new CredenzialiErrateException("Password errata!");

        if (utente.getRuolo().equals(Ruolo.STUDENTE)) {
            if (utenteRichiesto.isPresent()) {
                try {
                    responseBody = this.loginEsse3(loginRequest);
                } catch (CredenzialiErrateException e) {
                    throw new CredenzialiErrateException("Credenziali non valide!");
                } catch (ConnessioneException | JsonProcessingException e) {
                    throw new ConnessioneException("Server non raggiungibile!");
                }
            }

            try {
                jwtEsse3 = getJwtEsse3(responseBody);

                carriereDTO = this.getCarriereAttive(responseBody, jwtEsse3);
            } catch (JsonProcessingException e) {
                throw new ConnessioneException("Server non raggiungibile!");
            }
        }/* else if (utente.getRuolo().equals(Ruolo.DOCENTE) && utenteRichiesto.isPresent()) {
            try {
                this.loginEsse3(loginRequest);
            } catch (CredenzialiErrateException e) {
                throw new CredenzialiErrateException("Credenziali non valide!");
            } catch (ConnessioneException | JsonProcessingException e) {
                throw new ConnessioneException("Server non raggiungibile!");
            }
        }*/

        jwt = this.jwtService.generateToken(utente);

        utente.setJwt(jwt);
        this.utenteRepository.save(utente);

        utenteDTO = UtenteDTO.builder()
                .id(utente.getId())
                .nome(utente.getNome())
                .cognome(utente.getCognome())
                .ruolo(utente.getRuolo().toString())
                .build();

        return LoginResponse.builder()
                .jwt(jwt)
                .utente(utenteDTO)
                .carriere(carriereDTO)
                .build();
    }

    private String loginEsse3(LoginRequest loginRequest) throws JsonProcessingException {
        String url = "https://unimol.esse3.cineca.it/e3rest/api/login?optionalFields=jwt";
        String nomeUtente = loginRequest.getNomeUtente();
        String password = loginRequest.getPassword();

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(nomeUtente, password);
        headers.set("accept", "application/json");
        headers.set("X-Esse3-permit-invalid-jsessionid", "true");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful())
                return response.getBody();

        } catch (ResourceAccessException e) {
            throw new ConnessioneException("Server non raggiungibile!");
        } catch (HttpStatusCodeException e) {
            throw new CredenzialiErrateException("Credenziali non valide!");
        }

        return null;
    }

    private Utente registraUtente(String responseBody, LoginRequest loginRequest) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        String nome = jsonNode.get("user").get("firstName").asText();
        String cognome = jsonNode.get("user").get("lastName").asText();
        int grpId = jsonNode.get("user").get("grpId").asInt();

        if (grpId != 6 && jsonNode.get("user").get("docenteId").isNull())
            throw new CredenzialiErrateException("Credenziali non valide!");

        Utente utente = Utente.builder()
                .nome(nome)
                .cognome(cognome)
                .nomeUtente(loginRequest.getNomeUtente())
                .password(this.passwordEncoder.encode(loginRequest.getPassword()))  // Da rimuovere
                .ruolo(grpId == 6? Ruolo.STUDENTE: Ruolo.DOCENTE)
                .build();

        this.utenteRepository.save(utente);

        if (grpId != 6) {
            DocenteEsse3 docenteEsse3 = DocenteEsse3.builder()
                    .docente(utente)
                    .codEsse3(jsonNode.get("user").get("docenteId").asText())
                    .build();

            this.docenteEsse3Repository.save(docenteEsse3);
        }

        return utente;
    }

    private String getJwtEsse3(String responseBody) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        return jsonNode.get("jwt").asText();
    }

    private List<CarrieraDTO> getCarriereAttive(String responseBody, String jwtEsse3) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        List<CarrieraDTO> carriere = new ArrayList<>();

        ArrayNode trattiCarriera = (ArrayNode) jsonNode.get("user").get("trattiCarriera");

        for (JsonNode tratto : trattiCarriera)
            if (tratto.get("staStuCod").asText().equals("A")) {
                CarrieraDTO carriera = CarrieraDTO.builder()
                        .nomeCDS(tratto.get("cdsDes").asText())
                        .insegnamenti(this.getInsegnamentiCarriera(tratto.get("matId").asText(), jwtEsse3))
                        .build();

                carriere.add(carriera);
            }

        return carriere;
    }

    private List<InsegnamentoDTO> getInsegnamentiCarriera(String matId, String jwtEsse3) throws JsonProcessingException {
        List<InsegnamentoDTO> insegnamenti = new ArrayList<>();

        String url = "https://unimol.esse3.cineca.it/e3rest/api/libretto-service-v2/libretti/" + matId + "/righe/";

        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", "application/json");
        headers.set("X-Esse3-permit-invalid-jsessionid", "true");
        headers.set("Authorization", "Bearer " + jwtEsse3);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            for (JsonNode insegnamentoJson : jsonNode)
                if (insegnamentoJson.get("esito").get("modValCod").get("value").asText().equals("V")) {
                    String aaOffId = insegnamentoJson.get("chiaveADContestualizzata").get("aaOffId").asText();
                    String cdsId = insegnamentoJson.get("chiaveADContestualizzata").get("cdsId").asText();
                    String adCod = insegnamentoJson.get("adCod").asText();

                    InsegnamentoDTO insegnamento = InsegnamentoDTO.builder()
                            .nome(insegnamentoJson.get("adDes").asText())
                            .docenti(this.getDocentiPerInsegnamento(aaOffId, cdsId, adCod, jwtEsse3))
                            .build();

                    insegnamenti.add(insegnamento);
                }
        } else
            return insegnamenti;

        return insegnamenti;
    }

    private List<UtenteDTO> getDocentiPerInsegnamento(String aaOffId, String cdsId, String adCod, String jwtEsse3) throws JsonProcessingException {
        List<UtenteDTO> docenti = new ArrayList<>();

        String url = "https://unimol.esse3.cineca.it/e3rest/api/offerta-service-v1/offerte/" + aaOffId + "/" + cdsId + "/docentiPerUD?adCod=" + adCod;

        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", "application/json");
        headers.set("X-Esse3-permit-invalid-jsessionid", "true");
        headers.set("Authorization", "Bearer " + jwtEsse3);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            for (JsonNode docenteJson : jsonNode) {
                Optional<DocenteEsse3> docenteEsse3 = this.docenteEsse3Repository.findDocenteEsse3ByCodEsse3(docenteJson.get("docenteId").asText());

                if (docenteEsse3.isPresent()) {
                    Utente docente = docenteEsse3.get().getDocente();

                    UtenteDTO docenteDTO = UtenteDTO.builder()
                            .id(docente.getId())
                            .nome(docente.getNome())
                            .cognome(docente.getCognome())
                            .ruolo(docente.getRuolo().toString())
                            .build();

                    docenti.add(docenteDTO);
                }
            }
        } else
            return docenti;

        return docenti;
    }

    public String loginAdmin(LoginRequest loginRequest) {
        Optional<Utente> utenteRichiesto = this.utenteRepository.findUtenteByNomeUtente(loginRequest.getNomeUtente());

        Utente direttore;

        if (utenteRichiesto.isPresent()) {
            direttore = utenteRichiesto.get();

            if (this.direttoreRepository.findDirettoreByUtente(direttore).isEmpty())
                throw new PermessoNegatoException("Permesso negato!");

            if (direttore.getPassword() == null || direttore.getPassword().isEmpty()) {
                try {
                    this.loginEsse3(loginRequest);
                } catch (CredenzialiErrateException e) {
                    throw new CredenzialiErrateException("Credenziali non valide!");
                } catch (ConnessioneException | JsonProcessingException e) {
                    throw new ConnessioneException("Server non raggiungibile!");
                }
            } else if (!this.passwordEncoder.matches(loginRequest.getPassword(), direttore.getPassword()))
                throw new CredenzialiErrateException("Credenziali errate!");
        } else
            throw new CredenzialiErrateException("Credenziali errate!");

        String jwt = this.jwtService.generateToken(direttore);
        direttore.setJwt(jwt);
        this.utenteRepository.save(direttore);

        return jwt;
    }
}
