import Song from "../models/song.js";
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
};

const createSong = async (req, res) => {
  const { title, artist, album, genre } = req.body;

  try {
    const newSong = new Song({ title, artist, album, genre });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: "Error creating song", error });
  }
};

const updateSong = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSong = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSong)
      return res.status(404).json({ message: "Song not found" });
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: "Error updating song", error });
  }
};

const deleteSong = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong)
      return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ message: "Song deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error });
  }
};

const getStatistics = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct("artist").then(
      (artists) => artists.length
    );
    const totalAlbums = await Song.distinct("album").then(
      (albums) => albums.length
    );
    const totalGenres = await Song.distinct("genre").then(
      (genres) => genres.length
    );

    const songsByGenre = await Song.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
    ]);

    const songsByArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          songs: { $sum: 1 },
          albums: { $addToSet: "$album" },
        },
      },
    ]);

    const songsByAlbum = await Song.aggregate([
      { $group: { _id: "$album", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
      songsByGenre,
      songsByArtist: songsByArtist.map((artist) => ({
        artist: artist._id,
        songs: artist.songs,
        albums: artist.albums.length,
      })),
      songsByAlbum,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};

export default {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
  getStatistics,
};
